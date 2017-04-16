import {DnsPodApiBase} from "./base";
export interface IStatusReturn {
	code: string;
	message: string;
	created_at: string;
}

export interface IInfoVersionParams {
	
}
export interface IInfoVersionReturn {
	status: IStatusReturn;
}

export interface IUserDetailParams {
	
}
export interface IUserDetailReturn {
	status: IStatusReturn;
	info: {
		user: {
			real_name: string;
			user_type: string;
			telephone: string;
			im: string;
			nick: string;
			id: string;
			email: string;
			status: string;
			email_verified: string;
			telephone_verified: string;
			weixin_binded: string;
			agent_pending: boolean;
			balance: number;
			smsbalance: number;
			user_grade: string;
		};
	};
}

export interface IUserModifyParams {
	real_name?: any; /* 真实姓名, 如果用户类型是企业, 则为公司名称 */
	nick?: any; /* 用户称呼, 用于与用户联系时称呼用户 */
	telephone?: any; /* 用户手机号码 */
}
export interface IUserModifyReturn {
	status: IStatusReturn;
}

export interface IUserpasswdModifyParams {
	old_password?: any; /* 旧密码 */
	new_password?: any; /* 新密码 */
}
export interface IUserpasswdModifyReturn {
	status: IStatusReturn;
}

export interface IUseremailModifyParams {
	old_email?: any; /* 旧邮箱帐号 */
	new_email?: any; /* 新邮箱帐号 */
	password?: any; /* 密码 */
}
export interface IUseremailModifyReturn {
	status: IStatusReturn;
}

export interface ITelephoneverifyCodeParams {
	telephone?: any; /* 用户手机号码 */
}
export interface ITelephoneverifyCodeReturn {
	status: IStatusReturn;
	user: {
		verify_code: string;
		verify_desc: string;
	};
}

export interface IUserLogParams {
	
}
export interface IUserLogReturn { [key: string]: any; }

export interface IDomainCreateParams {
	domain?: any; /* 域名, 没有 www, 如 dnspod.com */
	group_id?: any; /* 域名分组ID, 可选参数 */
	is_mark?: any; /* 是否星标域名，”yes”、”no” 分别代表是和否 */
}
export interface IDomainCreateReturn {
	status: IStatusReturn;
	domain: {
		id: string;
		punycode: string;
		domain: string;
	};
}

export interface IDomainListParams {
	type?: any; /* 域名分组类型, 默认为’all’. 包含以下类型：

all：所有域名
mine：我的域名
share：共享给我的域名
ismark：星标域名
pause：暂停域名
vip：VIP域名
recent：最近操作过的域名
share_out：我共享出去的域名 */
	offset?: any; /* 记录开始的偏移, 第一条记录为 0, 依次类推 */
	length?: any; /* 要获取的域名数量, 比如获取20个, 则为20 */
	group_id?: any; /* 分组ID, 获取指定分组的域名。可以通过 获取域名分组 获取 group_id */
	keyword?: any; /* 搜索的关键字, 如果指定则只返回符合该关键字的域名 */
}
export interface IDomainListReturn {
	status: IStatusReturn;
	info: {
		domain_total: number;
		all_total: number;
		mine_total: number;
		share_total: number;
		vip_total: number;
		ismark_total: number;
		pause_total: number;
		error_total: number;
		lock_total: number;
		spam_total: number;
		vip_expire: number;
		share_out_total: number;
	};
	domains: {
		id: number;
		status: string;
		grade: string;
		group_id: string;
		searchengine_push: string;
		is_mark: string;
		ttl: string;
		cname_speedup: string;
		remark: string;
		created_on: string;
		updated_on: string;
		punycode: string;
		ext_status: string;
		name: string;
		grade_title: string;
		is_vip: string;
		owner: string;
		records: string;
		auth_to_anquanbao: boolean;
	};
}

export interface IDomainRemoveParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
}
export interface IDomainRemoveReturn {
	status: IStatusReturn;
}

export interface IDomainStatusParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	status?: any; /* 域名状态，”enable” 、”disable” 分别代表启用和暂停 */
}
export interface IDomainStatusReturn {
	status: IStatusReturn;
}

export interface IDomainInfoParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
}
export interface IDomainInfoReturn {
	status: IStatusReturn;
	domain: {
		id: string;
		name: string;
		punycode: string;
		grade: string;
		grade_title: string;
		status: string;
		ext_status: string;
		records: string;
		group_id: string;
		is_mark: string;
		remark: boolean;
		is_vip: string;
		searchengine_push: string;
		user_id: string;
		created_on: string;
		updated_on: string;
		ttl: string;
		cname_speedup: string;
		owner: string;
		auth_to_anquanbao: boolean;
	};
}

export interface IDomainLogParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	offset?: any; /* 记录开始的偏移，第一条记录为 0，依次类推，默认为0 */
	length?: any; /* 共要获取的日志条数，比如获取20条，则为20，默认为500条，单次最多获取500条 */
}
export interface IDomainLogReturn {
	status: IStatusReturn;
	log: string;
}

export interface IDomainSearchenginepushParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	status?: any; /* 是否推送，”yes”、”no” 分别代表开启和关闭 */
}
export interface IDomainSearchenginepushReturn {
	status: IStatusReturn;
}

export interface IDomainshareCreateParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	email?: any; /* 要共享到的邮箱 */
	mode?: any; /* 共享模式，”r”、”rw” 分别代表只读和读取、修改, 默认为 r */
	sub_domain?: any; /* 子域名共享, 如：www、bbs等. 如果要共享整个域名, 则无需提交此参数 */
}
export interface IDomainshareCreateReturn {
	status: IStatusReturn;
}

export interface IDomainshareListParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
}
export interface IDomainshareListReturn {
	status: IStatusReturn;
	share: {
		share_to: string;
		mode: string;
		status: string;
	};
	owner: string;
}

export interface IDomainshareModifyParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	email?: any; /* 被共享者的邮箱, 原来是什么就提交什么, 不能修改 */
	mode?: any; /* 共享模式，”r”、”rw” 分别代表只读和读取、修改, 默认为 r */
	sub_domain?: any; /* 子域名共享, 如：www、bbs等. 如果要共享整个域名, 则无需提交此参数 */
	old_sub_domain?: any; /* 已经成功共享的子域名, 如果只修改主域名共享, 则无需提交此参数 */
	new_sub_domain?: any; /* 要修改到的共享子域名 */
}
export interface IDomainshareModifyReturn {
	status: IStatusReturn;
}

export interface IDomainshareRemoveParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	email?: any; /* 被共享者的邮箱, 原来是什么就提交什么, 不能修改 */
}
export interface IDomainshareRemoveReturn {
	status: IStatusReturn;
}

export interface IDomainTransferParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	email?: any; /* 域名将要过户到的邮箱帐号 */
}
export interface IDomainTransferReturn {
	status: IStatusReturn;
}

export interface IDomainLockParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	days?: any; /* 域名要锁定的天数，最多可锁定的天数可以通过 获取域名权限 接口获取 */
}
export interface IDomainLockReturn {
	status: IStatusReturn;
	lock: {
		domain_id: number;
		lock_code: string;
		lock_end: string;
	};
}

export interface IDomainUnlockParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	lock_code?: any; /* 域名解锁码, 锁定的时候会返回 */
}
export interface IDomainUnlockReturn {
	status: IStatusReturn;
}

export interface IDomainaliasListParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
}
export interface IDomainaliasListReturn {
	status: IStatusReturn;
	alias: {
		id: string;
		domain: string;
	};
}

export interface IDomainaliasCreateParams {
	domain_id?: any; /* 要创建别名绑定的域名ID */
	domain?: any; /* 要绑定到的域名，不带 www，例如：dnspod.com */
}
export interface IDomainaliasCreateReturn {
	status: IStatusReturn;
	alias: {
		id: string;
		punycode: string;
	};
}

export interface IDomainaliasRemoveParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	alias_id?: any; /* 别名绑定的ID, 绑定域名的时候会返回 */
}
export interface IDomainaliasRemoveReturn {
	status: IStatusReturn;
}

export interface IDomaingroupListParams {
	
}
export interface IDomaingroupListReturn {
	status: IStatusReturn;
	groups: {
		group_id: number;
		group_name: string;
		group_type: string;
		size: number;
	};
}

export interface IDomaingroupCreateParams {
	group_name?: any; /* 分组名称 */
}
export interface IDomaingroupCreateReturn {
	status: IStatusReturn;
	groups: {
		id: string;
	};
}

export interface IDomaingroupModifyParams {
	group_id?: any; /* 要修改的分组ID */
	group_name?: any; /* 需要修改到的分组名称 */
}
export interface IDomaingroupModifyReturn {
	status: IStatusReturn;
}

export interface IDomaingroupRemoveParams {
	group_id?: any; /* 要删除的分组ID */
}
export interface IDomaingroupRemoveReturn {
	status: IStatusReturn;
}

export interface IDomainChangegroupParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	group_id?: any; /* 分组ID */
}
export interface IDomainChangegroupReturn {
	status: IStatusReturn;
}

export interface IDomainIsmarkParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	is_mark?: any; /* 是否星标域名，”yes”、”no” 分别代表是和否 */
}
export interface IDomainIsmarkReturn {
	status: IStatusReturn;
}

export interface IDomainRemarkParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	remark?: any; /* 域名备注, 删除备注请提交空内容 */
}
export interface IDomainRemarkReturn {
	status: IStatusReturn;
}

export interface IDomainPurviewParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
}
export interface IDomainPurviewReturn {
	status: IStatusReturn;
	purview: {
		name: string;
		value: number;
	};
}

export interface IDomainAcquireParams {
	domain?: any; /* 要取回的域名 */
}
export interface IDomainAcquireReturn {
	status: IStatusReturn;
	emails: string;
}

export interface IDomainAcquiresendParams {
	domain?: any; /* 要取回的域名 */
	email?: any; /* 域名取回WHOIS邮箱列表中的一个邮箱，验证码会发送到该邮箱 */
}
export interface IDomainAcquiresendReturn { [key: string]: any; }

export interface IDomainAcquirevalidateParams {
	domain?: any; /* 要取回的域名 */
	code?: any; /* 发送到邮箱的验证码 */
}
export interface IDomainAcquirevalidateReturn {
	status: IStatusReturn;
}

export interface IDomainAcquiresendNewParams {
	domain?: any; /* 要取回的域名 */
	whois_email?: any; /* 域名取回WHOIS邮箱列表中的一个邮箱，验证链接会发送到该邮箱 */
}
export interface IDomainAcquiresendNewReturn { [key: string]: any; }

export interface IRecordTypeParams {
	domain_grade?: any; /* 域名等级, 分别为：

旧套餐：D_Free、D_Plus、D_Extra、D_Expert、D_Ultra 分别对应免费套餐、个人豪华、企业1、企业2、企业3
新套餐：DP_Free、DP_Plus、DP_Extra、DP_Expert、DP_Ultra 分别对应新免费、个人专业版、企业创业版、企业标准版、企业旗舰版 */
}
export interface IRecordTypeReturn {
	status: IStatusReturn;
	types: string;
}

export interface IRecordLineParams {
	domain_id?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain?: any; /* 分别对应域名ID和域名, 提交其中一个即可 */
	domain_grade?: any; /* 域名等级, 分别为：

旧套餐：D_Free、D_Plus、D_Extra、D_Expert、D_Ultra 分别对应免费套餐、个人豪华、企业1、企业2、企业3
新套餐：DP_Free、DP_Plus、DP_Extra、DP_Expert、DP_Ultra 分别对应新免费、个人专业版、企业创业版、企业标准版、企业旗舰版 */
}
export interface IRecordLineReturn {
	status: IStatusReturn;
	line_ids: {
		默认: number;
		国内: string;
		国外: string;
		电信: string;
		联通: string;
		教育网: string;
		移动: string;
		百度: string;
		谷歌: string;
		搜搜: string;
		有道: string;
		必应: string;
		搜狗: string;
		奇虎: string;
		搜索引擎: string;
	};
	lines: string;
}

export interface IRecordCreateParams {
	domain_id?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	domain?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	sub_domain?: any; /* ，主机记录，，如，www，可选，如果不传，默认为，@ */
	record_type?: any; /* ，记录类型，通过API记录类型获得，大写英文，比如，A，，必选 */
	record_line?: any; /* ，记录线路，通过API记录线路获得，中文，比如，默认 */
	record_line_id?: any; /* 线路的ID，通过API记录线路获得，英文字符串，比如，‘10=1’，【record_line，和，record_line_id，二者传其一即可，系统优先取，record_line_id】 */
	value?: any; /* ，记录值，，如，IP，200.200.200.200，，CNAME，，cname.dnspod.com.，，MX，，mail.dnspod.com.，，必选 */
	mx?: any; /* {1-20}，，MX优先级，，当记录类型是，MX，时有效，范围1-20，，MX记录必选 */
	ttl?: any; /* {1-604800}，，TTL，范围1-604800，不同等级域名最小值不同，，可选 */
	status?: any; /* [“enable”，，“disable”]，记录初始状态，默认为”enable”，如果传入”disable”，解析不会生效，也不会验证负载均衡的限制，可选 */
	weight?: any; /* 权重信息，0到100的整数，可选。仅企业，VIP，域名可用，0，表示关闭，留空，者不传该参数，表示不设置权重信息 */
}
export interface IRecordCreateReturn {
	status: IStatusReturn;
	record: {
		id: string;
		name: string;
		status: string;
	};
}

export interface IRecordListParams {
	domain_id?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	domain?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	offset?: any; /* 记录开始的偏移，第一条记录为，0，依次类推，可选 */
	length?: any; /* 共要获取的记录的数量，比如获取20条，则为20，可选 */
	sub_domain?: any; /* 子域名，如果指定则只返回此子域名的记录，可选 */
	keyword?: any; /* 搜索的关键字，如果指定则只返回符合该关键字的记录，可选 */
}
export interface IRecordListReturn { [key: string]: any; }

export interface IRecordModifyParams {
	domain_id?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	domain?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	record_id?: any; /* 记录ID，必选 */
	sub_domain?: any; /* ，主机记录，，如，www，可选，如果不传，默认为，@ */
	record_type?: any; /* 记录类型，通过API记录类型获得，大写英文，比如，A，必选 */
	record_line?: any; /* 记录线路，通过API记录线路获得，中文，比如，默认，必选 */
	record_line_id?: any; /* 线路的ID，通过API记录线路获得，英文字符串，比如，‘10=1’，【record_line，和，record_line_id，二者传其一即可，系统优先取，record_line_id】 */
	value?: any; /* 记录值，，如，IP，200.200.200.200，，CNAME，，cname.dnspod.com.，，MX，，mail.dnspod.com.，必选 */
	mx?: any; /* {1-20}，MX优先级，，当记录类型是，MX，时有效，范围1-20，，mx记录必选 */
	ttl?: any; /* {1-604800}，TTL，范围1-604800，不同等级域名最小值不同，可选 */
	status?: any; /* [“enable”，，“disable”]，记录状态，默认为”enable”，如果传入”disable”，解析不会生效，也不会验证负载均衡的限制，可选 */
	weight?: any; /* 权重信息，0到100的整数，可选。仅企业，VIP，域名可用，0，表示关闭，留空，者不传该参数，表示不设置权重信息 */
}
export interface IRecordModifyReturn {
	status: IStatusReturn;
	record: {
		id: number;
		name: string;
		value: string;
		status: string;
	};
}

export interface IRecordRemoveParams {
	domain_id?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	domain?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	record_id?: any; /* 记录ID，必选 */
}
export interface IRecordRemoveReturn {
	status: IStatusReturn;
}

export interface IRecordDdnsParams {
	domain_id?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	domain?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	record_id?: any; /* 记录ID，必选 */
	sub_domain?: any; /* 主机记录，如，www */
	record_line?: any; /* 记录线路，通过API记录线路获得，中文，比如，默认，必选 */
	record_line_id?: any; /* 线路的ID，通过API记录线路获得，英文字符串，比如，‘10=1’，【record_line，和，record_line_id，二者传其一即可，系统优先取，record_line_id】 */
	value?: any; /* IP地址，例如，6.6.6.6，可选 */
}
export interface IRecordDdnsReturn {
	status: IStatusReturn;
	record: {
		id: number;
		name: string;
		value: string;
	};
}

export interface IRecordRemarkParams {
	domain_id?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	domain?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	record_id?: any; /* 记录ID，必选 */
	remark?: any; /* 域名备注，删除备注请提交空内容，必选 */
}
export interface IRecordRemarkReturn {
	status: IStatusReturn;
}

export interface IRecordInfoParams {
	domain_id?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	domain?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	record_id?: any; /* 记录ID，必选 */
}
export interface IRecordInfoReturn {
	status: IStatusReturn;
	domain: {
		id: number;
		domain: string;
		domain_grade: string;
	};
	record: {
		id: string;
		sub_domain: string;
		record_type: string;
		record_line: string;
		record_line_id: string;
		value: string;
		weight: { [key: string]: any; };
		mx: string;
		ttl: string;
		enabled: string;
		monitor_status: string;
		remark: string;
		updated_on: string;
		domain_id: string;
	};
}

export interface IRecordStatusParams {
	domain_id?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	domain?: any; /* ，分别对应域名ID和域名，，提交其中一个即可 */
	record_id?: any; /* 记录ID，必选 */
	status?: any; /* {enable|disable}，新的状态，必选 */
}
export interface IRecordStatusReturn {
	status: IStatusReturn;
	record: {
		id: number;
		name: string;
		status: string;
	};
}

export interface IBatchDomainCreateParams {
	domains?: any; /* 多个域名之间以英文的逗号分割 */
	record_value?: any; /* 为每个域名添加，@，和，www，的，A，记录值，记录值为IP，可选，如果不传此参数，者传空，将只添加域名，不添加记录 */
}
export interface IBatchDomainCreateReturn {
	status: IStatusReturn;
	job_id: string;
	detail: {
		id: number;
		domain: string;
		domain_grade: string;
		err_msg: { [key: string]: any; };
		status: string;
		operation: string;
		records: {
			id: number;
			sub_domain: string;
			record_type: string;
			area: string;
			value: string;
			ttl: number;
			err_msg: { [key: string]: any; };
			status: string;
			operation: string;
		};
	};
}

export interface IBatchRecordCreateParams {
	domain_id?: any; /* 域名ID，多个，domain_id，用英文逗号进行分割， */
}
export interface IBatchRecordCreateReturn {
	status: IStatusReturn;
	job_id: string;
	detail: {
		id: number;
		domain_id: string;
		domain: string;
		domain_grade: string;
		err_msg: { [key: string]: any; };
		status: string;
		operation: { [key: string]: any; };
		records: {
			id: number;
			sub_domain: string;
			record_type: string;
			area: string;
			value: string;
			mx: string;
			ttl: string;
			err_msg: { [key: string]: any; };
			status: string;
			operation: string;
		};
	};
}

export interface IBatchRecordModifyParams {
	record_id?: any; /* 记录的ID，多个，record_id，用英文的逗号分割 */
	change?: any; /* 要修改的字段，可选值为，[“sub_domain”、”record_type”、”area”、”value”、”mx”、”ttl”、”status”]，中的某一个 */
	change_to?: any; /* 修改为，具体依赖，change，字段，必填参数 */
	value?: any; /* 要修改到的记录值，可选，仅当，change，字段为，“record_type”，时为必填参数 */
	mx?: any; /* MX记录优先级，可选，仅当修改为，MX，记录时为必填参数 */
}
export interface IBatchRecordModifyReturn {
	status: IStatusReturn;
	job_id: string;
	detail: {
		domain_id: number;
		domain: string;
		err_msg: { [key: string]: any; };
		status: string;
		operation: { [key: string]: any; };
		records: {
			record_id: string;
			sub_domain: string;
			area: string;
			record_type: string;
			ttl: string;
			value: string;
			enabled: string;
			status: string;
			err_msg: { [key: string]: any; };
			id: number;
			operation: string;
		};
		domain_grade: string;
		id: number;
	};
}

export interface IBatchDetailParams {
	job_id?: any; /* 任务ID */
}
export interface IBatchDetailReturn {
	status: IStatusReturn;
	detail: {
		id: number;
		domain: string;
		domain_grade: string;
		err_msg: { [key: string]: any; };
		status: string;
		operation: string;
		records: {
			id: number;
			sub_domain: string;
			record_type: string;
			area: string;
			value: string;
			ttl: number;
			err_msg: { [key: string]: any; };
			status: string;
			operation: string;
			record_id: number;
			mx: { [key: string]: any; };
		};
		domain_id: string;
	};
	total: number;
	success: number;
	fail: number;
	type: string;
	created_at: string;
}

export interface IMonitorListsubdomainParams {
	domain?: any; /* ，必选 */
	domain_id?: any; /* ，必选 */
}
export interface IMonitorListsubdomainReturn {
	status: IStatusReturn;
	domain: {
		id: number;
		name: string;
		punycode: string;
		grade: string;
		owner: string;
	};
	subdomain: string;
}

export interface IMonitorListsubvalueParams {
	domain?: any; /* ，必选 */
	domain_id?: any; /* ，必选 */
	subdomain?: any; /* 子域名，必选 */
}
export interface IMonitorListsubvalueReturn {
	status: IStatusReturn;
	domain: {
		id: number;
		name: string;
		punycode: string;
		grade: string;
	};
	points: {
		max: number;
		list: {
			ctc: string;
			cuc: string;
			cmc: string;
		};
	};
	records: {
		id: string;
		area: string;
		value: string;
	};
}

export interface IMonitorListParams {
	
}
export interface IMonitorListReturn {
	status: IStatusReturn;
	info: {
		total_count: number;
		down_count: number;
	};
	monitors: {
		monitor_id: string;
		domain: string;
		domain_id: string;
		domain_grade: string;
		record_id: string;
		sub_domain: string;
		record_line: string;
		ip: string;
		now_ip: string;
		host: string;
		port: string;
		monitor_type: string;
		monitor_path: string;
		monitor_interval: string;
		points: string;
		bak_ip: string;
		status: string;
		status_code: string;
		sms_notice: string;
		email_notice: string;
		less_notice: string;
		callback_url: string;
		callback_key: string;
		monitor_status: string;
		created_on: string;
		updated_on: string;
		bak_ip_status: undefined;
	};
}

export interface IMonitorCreateParams {
	domain_id?: any; /* 域名编号，必选， */
	record_id?: any; /* 记录编号，必选， */
	port?: any; /* 监控端口，比如80，必选， */
	monitor_interval?: any; /* 监控间隔，支持{60|180|360|}，必选， */
	host?: any; /* 监控主机头，比如，www.dnspod.cn，必选， */
	monitor_type?: any; /* 监控类型，支持{http|https}，必选， */
	monitor_path?: any; /* 监控路径，比如/，必选， */
	points?: any; /* 监控节点，用，分隔多个，只能选择列表中的节点，并且有数量限制，必选， */
	pass?: any; /* 只监控，不切换 */
	pause?: any; /* 老版智能暂停功能，详见https，//support.dnspod.cn/Kb/showarticle/tsid/179 */
	pause2?: any; /* 智能暂停v2，，发现ip宕机后直接暂停该记录，无其它规则 */
	auto?: any; /* 智能切换 */
	keep_ttl?: any; /* {yes|no}，宕机切换后是否修改ttl，可选，默认为，no， */
	sms_notice?: any; /* 短信通知，me域名所有者，share共享用户，用，分隔多选择，比如me，share，，可选， */
	email_notice?: any; /* 邮件通知，me域名所有者，share共享用户，用，分隔多选择，比如me，share，可选， */
	less_notice?: any; /* {yes|no}是否一个小时内只发一次通知，可选， */
	callback_url?: any; /* ，可选，回调URL，宕机了会将相关的参数提交到此设置的URL，具体参考回调URL说明，可选， */
	callback_key?: any; /* 可选，回调密钥，如果设置了回调URL请设置此参数以保证安全，可选， */
}
export interface IMonitorCreateReturn {
	status: IStatusReturn;
	monitor: {
		monitor_id: string;
		record_id: number;
	};
}

export interface IMonitorModifyParams {
	monitor_id?: any; /* 监控编号，必选， */
	port?: any; /* 监控端口，比如80，必选， */
	monitor_interval?: any; /* 监控间隔，支持{60|180|360|}，必选， */
	monitor_type?: any; /* 监控类型，支持{http|https}，必选， */
	monitor_path?: any; /* 监控路径，比如/，必选， */
	points?: any; /* 监控节点，用，分隔多个，只能选择列表中的节点，并且有数量限制，必选， */
	pass?: any; /* 只监控，不切换 */
	pause?: any; /* 老版智能暂停功能，详见https，//support.dnspod.cn/Kb/showarticle/tsid/179 */
	pause2?: any; /* 智能暂停v2，，发现ip宕机后直接暂停该记录，无其它规则 */
	auto?: any; /* 智能切换 */
	host?: any; /* 监控主机头，比如，www.dnspod.cn，可选， */
	keep_ttl?: any; /* {yes|no}，宕机切换后是否修改ttl，可选，默认为，no， */
	sms_notice?: any; /* 短信通知，me域名所有者，share共享用户，用，分隔多选择，比如me，share，，可选， */
	email_notice?: any; /* 邮件通知，me域名所有者，share共享用户，用，分隔多选择，比如me，share，可选， */
	less_notice?: any; /* {yes|no}是否一个小时内只发一次通知，可选， */
	callback_url?: any; /* ，可选，回调URL，宕机了会将相关的参数提交到此设置的URL，具体参考回调URL说明，可选， */
	callback_key?: any; /* 可选，回调密钥，如果设置了回调URL请设置此参数以保证安全，可选， */
}
export interface IMonitorModifyReturn {
	status: IStatusReturn;
}

export interface IMonitorRemoveParams {
	monitor_id?: any; /* 监控编号 */
}
export interface IMonitorRemoveReturn {
	status: IStatusReturn;
}

export interface IMonitorInfoParams {
	monitor_id?: any; /* 监控编号 */
}
export interface IMonitorInfoReturn {
	status: IStatusReturn;
	info: {
		monitor_id: string;
		domain: string;
		domain_id: string;
		domain_grade: string;
		record_id: string;
		sub_domain: string;
		record_line: string;
		ip: string;
		now_ip: string;
		host: string;
		port: string;
		monitor_type: string;
		monitor_path: string;
		monitor_interval: string;
		points: string;
		bak_ip: string;
		status: string;
		status_code: string;
		sms_notice: string;
		email_notice: string;
		less_notice: string;
		callback_url: string;
		callback_key: string;
		monitor_status: string;
		created_on: string;
		updated_on: string;
		bak_ip_status: undefined;
	};
}

export interface IMonitorSetstatusParams {
	monitor_id?: any; /* 监控编号，必选 */
	status?: any; /* {enabled|disabled}，新的状态，必选 */
}
export interface IMonitorSetstatusReturn {
	status: IStatusReturn;
}

export interface IMonitorGethistoryParams {
	monitor_id?: any; /* 监控编号，必选 */
	hours?: any; /* 获取最近多少个小时的记录，可选 */
}
export interface IMonitorGethistoryReturn {
	status: IStatusReturn;
	domain: {
		id: string;
		domain: string;
		domain_grade: string;
	};
	record: {
		id: string;
		sub_domain: string;
		ip: string;
	};
	monitor_history: {
		data: {
			message: string;
			code: number;
			data: {
				status: string;
				status_code: number;
				createtime: string;
				responsetime: number;
			};
		};
		point: string;
	};
}

export interface IMonitorUserdescParams {
	
}
export interface IMonitorUserdescReturn {
	status: IStatusReturn;
	desc: {
		unmoniting_count: number;
		moniting_count: number;
		down_count: number;
	};
	user: {
		max_count: number;
		use_count: number;
	};
}

export interface IMonitorGetdownsParams {
	offset?: any; /* 记录开始的偏移，第一条记录为，0，依次类推，可选 */
	length?: any; /* 共要获取的记录的数量，比如获取20条，则为20，可选 */
}
export interface IMonitorGetdownsReturn {
	status: IStatusReturn;
	info: {
		total_count: string;
	};
	monitor_downs: {
		monitor_id: string;
		host: string;
		record_line: string;
		ip: string;
		warn_reason: string;
		switch_log: undefined;
		created_on: string;
		updated_on: string;
	};
}


	
export class DnsPodApi extends DnsPodApiBase {
	/**
	 * @document https://www.dnspod.cn/docs/info.html#info-version
	 */
	public infoVersion(params: IInfoVersionParams = <any>{}): Promise<IInfoVersionReturn> {
		return this._request("https://dnsapi.cn/Info.Version","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/accounts.html#user-detail
	 */
	public userDetail(params: IUserDetailParams = <any>{}): Promise<IUserDetailReturn> {
		return this._request("https://dnsapi.cn/User.Detail","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/accounts.html#user-modify
	 */
	public userModify(params: IUserModifyParams = <any>{}): Promise<IUserModifyReturn> {
		return this._request("https://dnsapi.cn/User.Modify","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/accounts.html#userpasswd-modify
	 */
	public userpasswdModify(params: IUserpasswdModifyParams = <any>{}): Promise<IUserpasswdModifyReturn> {
		return this._request("https://dnsapi.cn/Userpasswd.Modify","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/accounts.html#useremail-modify
	 */
	public useremailModify(params: IUseremailModifyParams = <any>{}): Promise<IUseremailModifyReturn> {
		return this._request("https://dnsapi.cn/Useremail.Modify","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/accounts.html#user-telephoneverify
	 */
	public telephoneverifyCode(params: ITelephoneverifyCodeParams = <any>{}): Promise<ITelephoneverifyCodeReturn> {
		return this._request("https://dnsapi.cn/Telephoneverify.Code","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/accounts.html#user-log
	 */
	public userLog(params: IUserLogParams = <any>{}): Promise<IUserLogReturn> {
		return this._request("https://dnsapi.cn/User.Log","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-create
	 */
	public domainCreate(params: IDomainCreateParams = <any>{}): Promise<IDomainCreateReturn> {
		return this._request("https://dnsapi.cn/Domain.Create","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-list
	 */
	public domainList(params: IDomainListParams = <any>{}): Promise<IDomainListReturn> {
		return this._request("https://dnsapi.cn/Domain.List","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-remove
	 */
	public domainRemove(params: IDomainRemoveParams = <any>{}): Promise<IDomainRemoveReturn> {
		return this._request("https://dnsapi.cn/Domain.Remove","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-status
	 */
	public domainStatus(params: IDomainStatusParams = <any>{}): Promise<IDomainStatusReturn> {
		return this._request("https://dnsapi.cn/Domain.Status","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-info
	 */
	public domainInfo(params: IDomainInfoParams = <any>{}): Promise<IDomainInfoReturn> {
		return this._request("https://dnsapi.cn/Domain.Info","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-log
	 */
	public domainLog(params: IDomainLogParams = <any>{}): Promise<IDomainLogReturn> {
		return this._request("https://dnsapi.cn/Domain.Log","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-searchenginepush
	 */
	public domainSearchenginepush(params: IDomainSearchenginepushParams = <any>{}): Promise<IDomainSearchenginepushReturn> {
		return this._request("https://dnsapi.cn/Domain.Searchenginepush","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domainshare-create
	 */
	public domainshareCreate(params: IDomainshareCreateParams = <any>{}): Promise<IDomainshareCreateReturn> {
		return this._request("https://dnsapi.cn/Domainshare.Create","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domainshare-list
	 */
	public domainshareList(params: IDomainshareListParams = <any>{}): Promise<IDomainshareListReturn> {
		return this._request("https://dnsapi.cn/Domainshare.List","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domainshare-modify
	 */
	public domainshareModify(params: IDomainshareModifyParams = <any>{}): Promise<IDomainshareModifyReturn> {
		return this._request("https://dnsapi.cn/Domainshare.Modify","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domainshare-remove
	 */
	public domainshareRemove(params: IDomainshareRemoveParams = <any>{}): Promise<IDomainshareRemoveReturn> {
		return this._request("https://dnsapi.cn/Domainshare.Remove","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-transfer
	 */
	public domainTransfer(params: IDomainTransferParams = <any>{}): Promise<IDomainTransferReturn> {
		return this._request("https://dnsapi.cn/Domain.Transfer","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-lock
	 */
	public domainLock(params: IDomainLockParams = <any>{}): Promise<IDomainLockReturn> {
		return this._request("https://dnsapi.cn/Domain.Lock","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-unlock
	 */
	public domainUnlock(params: IDomainUnlockParams = <any>{}): Promise<IDomainUnlockReturn> {
		return this._request("https://dnsapi.cn/Domain.Unlock","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domainalias-list
	 */
	public domainaliasList(params: IDomainaliasListParams = <any>{}): Promise<IDomainaliasListReturn> {
		return this._request("https://dnsapi.cn/Domainalias.List","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domainalias-create
	 */
	public domainaliasCreate(params: IDomainaliasCreateParams = <any>{}): Promise<IDomainaliasCreateReturn> {
		return this._request("https://dnsapi.cn/Domainalias.Create","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domainalias-remove
	 */
	public domainaliasRemove(params: IDomainaliasRemoveParams = <any>{}): Promise<IDomainaliasRemoveReturn> {
		return this._request("https://dnsapi.cn/Domainalias.Remove","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domaingroup-list
	 */
	public domaingroupList(params: IDomaingroupListParams = <any>{}): Promise<IDomaingroupListReturn> {
		return this._request("https://dnsapi.cn/Domaingroup.List","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domaingroup-create
	 */
	public domaingroupCreate(params: IDomaingroupCreateParams = <any>{}): Promise<IDomaingroupCreateReturn> {
		return this._request("https://dnsapi.cn/Domaingroup.Create","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domaingroup-modify
	 */
	public domaingroupModify(params: IDomaingroupModifyParams = <any>{}): Promise<IDomaingroupModifyReturn> {
		return this._request("https://dnsapi.cn/Domaingroup.Modify","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domaingroup-remove
	 */
	public domaingroupRemove(params: IDomaingroupRemoveParams = <any>{}): Promise<IDomaingroupRemoveReturn> {
		return this._request("https://dnsapi.cn/Domaingroup.Remove","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-changegroup
	 */
	public domainChangegroup(params: IDomainChangegroupParams = <any>{}): Promise<IDomainChangegroupReturn> {
		return this._request("https://dnsapi.cn/Domain.Changegroup","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-ismark
	 */
	public domainIsmark(params: IDomainIsmarkParams = <any>{}): Promise<IDomainIsmarkReturn> {
		return this._request("https://dnsapi.cn/Domain.Ismark","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-remark
	 */
	public domainRemark(params: IDomainRemarkParams = <any>{}): Promise<IDomainRemarkReturn> {
		return this._request("https://dnsapi.cn/Domain.Remark","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-purview
	 */
	public domainPurview(params: IDomainPurviewParams = <any>{}): Promise<IDomainPurviewReturn> {
		return this._request("https://dnsapi.cn/Domain.Purview","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#whois
	 */
	public domainAcquire(params: IDomainAcquireParams = <any>{}): Promise<IDomainAcquireReturn> {
		return this._request("https://dnsapi.cn/Domain.Acquire","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-acquiresend
	 */
	public domainAcquiresend(params: IDomainAcquiresendParams = <any>{}): Promise<IDomainAcquiresendReturn> {
		return this._request("https://dnsapi.cn/Domain.Acquiresend","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-acquirevalidate
	 */
	public domainAcquirevalidate(params: IDomainAcquirevalidateParams = <any>{}): Promise<IDomainAcquirevalidateReturn> {
		return this._request("https://dnsapi.cn/Domain.Acquirevalidate","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#domain-acquiresend-new
	 */
	public domainAcquiresendNew(params: IDomainAcquiresendNewParams = <any>{}): Promise<IDomainAcquiresendNewReturn> {
		return this._request("https://dnsapi.cn/Domain.Acquiresend.New","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#record-type
	 */
	public recordType(params: IRecordTypeParams = <any>{}): Promise<IRecordTypeReturn> {
		return this._request("https://dnsapi.cn/Record.Type","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/domains.html#record-line
	 */
	public recordLine(params: IRecordLineParams = <any>{}): Promise<IRecordLineReturn> {
		return this._request("https://dnsapi.cn/Record.Line","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/records.html#record-create
	 */
	public recordCreate(params: IRecordCreateParams = <any>{}): Promise<IRecordCreateReturn> {
		return this._request("https://dnsapi.cn/Record.Create","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/records.html#record-list
	 */
	public recordList(params: IRecordListParams = <any>{}): Promise<IRecordListReturn> {
		return this._request("https://dnsapi.cn/Record.List","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/records.html#record-modify
	 */
	public recordModify(params: IRecordModifyParams = <any>{}): Promise<IRecordModifyReturn> {
		return this._request("https://dnsapi.cn/Record.Modify","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/records.html#record-remove
	 */
	public recordRemove(params: IRecordRemoveParams = <any>{}): Promise<IRecordRemoveReturn> {
		return this._request("https://dnsapi.cn/Record.Remove","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/records.html#dns
	 */
	public recordDdns(params: IRecordDdnsParams = <any>{}): Promise<IRecordDdnsReturn> {
		return this._request("https://dnsapi.cn/Record.Ddns","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/records.html#record-remark
	 */
	public recordRemark(params: IRecordRemarkParams = <any>{}): Promise<IRecordRemarkReturn> {
		return this._request("https://dnsapi.cn/Record.Remark","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/records.html#record-info
	 */
	public recordInfo(params: IRecordInfoParams = <any>{}): Promise<IRecordInfoReturn> {
		return this._request("https://dnsapi.cn/Record.Info","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/records.html#record-status
	 */
	public recordStatus(params: IRecordStatusParams = <any>{}): Promise<IRecordStatusReturn> {
		return this._request("https://dnsapi.cn/Record.Status","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/batch.html#batch-domain-create
	 */
	public batchDomainCreate(params: IBatchDomainCreateParams = <any>{}): Promise<IBatchDomainCreateReturn> {
		return this._request("https://dnsapi.cn/Batch.Domain.Create","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/batch.html#batch-record-create
	 */
	public batchRecordCreate(params: IBatchRecordCreateParams = <any>{}): Promise<IBatchRecordCreateReturn> {
		return this._request("https://dnsapi.cn/Batch.Record.Create","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/batch.html#batch-record-modify
	 */
	public batchRecordModify(params: IBatchRecordModifyParams = <any>{}): Promise<IBatchRecordModifyReturn> {
		return this._request("https://dnsapi.cn/Batch.Record.Modify","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/batch.html#batch-detail
	 */
	public batchDetail(params: IBatchDetailParams = <any>{}): Promise<IBatchDetailReturn> {
		return this._request("https://dnsapi.cn/Batch.Detail","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#a
	 */
	public monitorListsubdomain(params: IMonitorListsubdomainParams = <any>{}): Promise<IMonitorListsubdomainReturn> {
		return this._request("https://dnsapi.cn/Monitor.Listsubdomain","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-listsubvalue
	 */
	public monitorListsubvalue(params: IMonitorListsubvalueParams = <any>{}): Promise<IMonitorListsubvalueReturn> {
		return this._request("https://dnsapi.cn/Monitor.Listsubvalue","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-list
	 */
	public monitorList(params: IMonitorListParams = <any>{}): Promise<IMonitorListReturn> {
		return this._request("https://dnsapi.cn/Monitor.List","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-create
	 */
	public monitorCreate(params: IMonitorCreateParams = <any>{}): Promise<IMonitorCreateReturn> {
		return this._request("https://dnsapi.cn/Monitor.Create","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-modify
	 */
	public monitorModify(params: IMonitorModifyParams = <any>{}): Promise<IMonitorModifyReturn> {
		return this._request("https://dnsapi.cn/Monitor.Modify","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-remove
	 */
	public monitorRemove(params: IMonitorRemoveParams = <any>{}): Promise<IMonitorRemoveReturn> {
		return this._request("https://dnsapi.cn/Monitor.Remove","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-info
	 */
	public monitorInfo(params: IMonitorInfoParams = <any>{}): Promise<IMonitorInfoReturn> {
		return this._request("https://dnsapi.cn/Monitor.Info","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-setstatus
	 */
	public monitorSetstatus(params: IMonitorSetstatusParams = <any>{}): Promise<IMonitorSetstatusReturn> {
		return this._request("https://dnsapi.cn/Monitor.Setstatus","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-gethistory
	 */
	public monitorGethistory(params: IMonitorGethistoryParams = <any>{}): Promise<IMonitorGethistoryReturn> {
		return this._request("https://dnsapi.cn/Monitor.Gethistory","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-userdesc
	 */
	public monitorUserdesc(params: IMonitorUserdescParams = <any>{}): Promise<IMonitorUserdescReturn> {
		return this._request("https://dnsapi.cn/Monitor.Userdesc","POST",params);
	}
	
	/**
	 * @document https://www.dnspod.cn/docs/d-monitor.html#monitor-getdowns
	 */
	public monitorGetdowns(params: IMonitorGetdownsParams = <any>{}): Promise<IMonitorGetdownsReturn> {
		return this._request("https://dnsapi.cn/Monitor.Getdowns","POST",params);
	}
	
	
}