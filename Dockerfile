FROM node:alpine

WORKDIR /data
VOLUME /mnt

# https://support.dnspod.cn/Kb/showarticle/tsid/83/
ARG IN_CHINA=no
ARG NPM_REGISTRY=""
ENV  \
 IN_CHINA="${IN_CHINA}" \
 NS=f1g1ns1.dnspod.net/f1g1ns2.dnspod.net \
# https://support.dnspod.cn/Kb/showarticle/tsid/227/
 LOGIN_TOKEN="" \
# https://www.dnspod.cn/console/user/security#
 DYNAMIC_TOKEN="" \
# how to get ip address
 IP_DETECT='regexp+http://1212.ip138.com/ic.asp#/您的IP是：\[(\d+.\d+.\d+.\d+)\]/' \
# ENV IP_DETECT='json+http://192.168.1.1/wanInfoGet.json#wanInfo.wanPppConn.$[ServiceMode=2].ExternalIPAddress'
# ENV IP_DETECT='file:///mnt/ip-from-outside-line-by-line.txt'
# ENV IP_DETECT='callback:///mnt/ip-detect.js'

 IP_DETECT_AUTH="" \

 IP_CHANGE="interval:?minutes=5"

COPY . /data

RUN pwd && ls -la && sh _build_script.sh

ENTRYPOINT [ "/usr/local/bin/node", "dist/server.js" ]
