import * as request from "request-promise-native";
import * as _request from "request";
import {type, arch} from 'os';

const version = require(__dirname + '/../../package.json').version;
const uaString = [
	'com.github.GongT.ddnspod',
	`(package: ${version}, docker: ${process.env.IN_DOCKER? 'YES' : 'NO'})`,
	`nodejs (${process.version}, official, ${type()} ${arch()})`
].join(' ');

export interface DnsPodApiConfig {
	login_token: string;
	login_code?: string;
	lang?: 'en'|'cn',
}
export interface IRequestData {
	[key: string]: any;
}

export class DnsPodApiBase {
	private params: DnsPodApiConfig;
	private config: _request.CoreOptions = {};
	
	constructor(params: string|DnsPodApiConfig) {
		if (typeof params === 'string') {
			params = <DnsPodApiConfig>{
				login_token: params,
			};
		}
		this.params = Object.assign({
			error_on_empty: 'no',
			format: 'json',
		}, params);
		
		if (!this.params.lang) {
			this.params.lang = process.env.IN_CHINA === 'yes'? 'cn' : 'en';
		}
	}
	
	public _requestConfigure(config: _request.CoreOptions) {
		Object.assign(this.config, config);
	}
	
	protected _request(url: string, method: string, params: IRequestData): Promise<any> {
		const input = Object.assign({}, this.params, params);
		const opt: request.Options = Object.assign({}, this.config, {
			url: url,
			json: true,
			method: method,
			headers: {
				'User-Agent': uaString,
			}
		});
		if (method.toUpperCase() === 'POST') {
			opt.form = input;
		} else {
			opt.qs = input;
		}
		return <any>request(opt).then((data) => {
			if (!data || !data.status) {
				throw new Error('unknown dnspod response: no data or no status.');
			}
			if (data.status.code != '1') {
				throw new Error(data.status.message || `error code - ${data.status.code}`);
			}
			return data;
		});
	}
}
