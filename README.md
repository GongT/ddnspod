# dnspod 动态域名解析

功能：
* 通过多种方式获取自身IP：
    * regexp：利用（多个）正则表达式，从任意网站页面获取IP
    * json：从部分可以返回json的路由器获取IP（例如某些光猫）
    * file：文件系统指定文件读取IP
    * callback：运行文件系统中指定js文件，返回IP
    * *ping-tcp：通过连接指定主机，由对方发回ip（未实现）*
* 多种刷新方式：
	* interval：每隔一段时间检查一次ip变化
	* *notify：监视特定文件，一旦改变文件就检查一次ip变化*
	* *ping：每秒ping指定主机，失败再成功后检测ip变化*
    * *ping-tcp：通过tcp连接指定主机，并发送空闲包，出现断开再重连，检测ip变化*
* 不限域名类型（例如动态更新NS记录）
* 支持dnspod新版用户认证、D令牌
* 可直接在docker中运行

## 运行
```bash
docker run -d --restart=always --name ddnspod \
    -e 'LOGIN_TOKEN=登录token' \
    -e 'DYNAMIC_TOKEN=D令牌当前显示（没有则删除这一行）' \
    -e 'IP_DETECT=(见下方说明)' \
    -e 'IP_CHANGE=(见下方说明)' \
	-e 'NS=(见下方说明)' \
	gongt/ddnspod \
	www.example.com blog.test.net
```

## 配置

#### LOGIN_TOKEN
登录token的添加方法: https://support.dnspod.cn/Kb/showarticle/tsid/227/

*这是唯一一个必填参数*

#### IP_DETECT_AUTH - 在获取IP前进行认证
> method+http://192.168.1.1/login.cgi?params=xxxxx

默认为空，不进行认证    
method可选get、post，默认为get

> EG: http://192.168.1.1/login.cgi?username=user&psd=h68gqfs9

#### IP_DETECT - 配置如何获取IP
1. **网页正则：**
> regexp+http(s)://some.domain.com/get/ip.php#/正则表达式1/ig,/正则表达式2/ig,...

其中正则表达式按顺序执行，必须包含一个匹配组，它的内容用作下一个正则的输入     
***注意编码格式！只能处理UTF8***

> EG: regexp+http://1212.ip138.com/ic.asp#/<center>(.+)<\/center>/,/\[(\d+\.\d+\.\d+\.\d+)\]/
	
2. **JSON**
> json+http://user:password@192.168.1.1/wanInfoGet.json#where.to.find.ip.address

这样一个json：{a:{b:{c:1}}}，想要取到“c”的值，就写`a.b.c`    
遇到数组，用$表示，如果不是数组的每一项都需要，则在$后面加`[key="value"]`。     
例1：{ x:[ {a:1}, {b:"b"}, {a:1, b:"b", ip:"127.0.0.1"} ] } ，想要取到“ip”的值，就写`x.$[a="1"][b="b"].ip`   
例2：{ x:[ {ip:"172.17.0.1"}, {ip:"127.0.0.1"} ] } ，想要取到两个“ip”的值，就写`x.$.ip`   

> EG: json+http://user:h68gqfs9@192.168.1.1/wanInfoGet.json#wanInfo.wanPppConn.$[ServiceMode=2].ExternalIPAddress

3. **IP文件**
> file:///mnt/file.txt

使用docker时，需要加参数“-v "/path/to/dir:/mnt"”，并保证/path/to/dir有这个文件

**不要直接挂载文件！**

4. **js函数**
> file:///mnt/callback.js

同样需要在docker运行时添加-v参数

callback.js必须导出`default`函数，它返回promise，并解决为数组，每一项一个ip    
不需安装既可使用require("request-native-promise")包，详情参考npm上这个包的文档。    
其他npm包直接安装在callback.js旁边既可

#### IP_CHANGE - 配置如何检测更改
1. 定时器
> interval:?minutes=5

#### NS - 配置使用的DNS服务器

可用列表参考：https://support.dnspod.cn/Kb/showarticle/tsid/83/

直接带着斜线原样复制过来    
默认是免费套餐：`f1g1ns1.dnspod.net/f1g1ns2.dnspod.net`
