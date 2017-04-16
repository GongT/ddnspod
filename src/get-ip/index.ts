import {format, Url} from "url";
import {die} from "../server";
import {fetchFromUrl} from "./fetch/remote";
import {callbackFromFile} from "./fetch/js";
import {fetchFromFile} from "./fetch/file";
import {splitParser} from "./parse/split";
import {jsonParser} from "./parse/json";
import {regexpParser} from "./parse/regexp";

export interface Fetcher {
	(): Promise<string>;
}
export interface Parser {
	(content: string): string[];
}
export interface GetIpAddressFunc {
	(): Promise<string[]>;
}

export function getIpAddress(ipDetect: Url, ipDetectAuth?: Url): GetIpAddressFunc {
	const [_, method, http] = /^([a-z]+)\+?(.+)?:$/i.exec(ipDetect.protocol);
	const hash = decodeURIComponent(ipDetect.hash.replace(/^#/, ''));
	ipDetect.hash = null;
	
	let fetcher: Fetcher, parser: Parser;
	
	switch (method.toLowerCase()) {
	case 'regexp':
		ipDetect.protocol = `${http || 'http'}:`;
		fetcher = fetchFromUrl(format(ipDetect));
		parser = regexpParser(hash);
		break;
	case 'json':
		ipDetect.protocol = `${http || 'http'}:`;
		fetcher = fetchFromUrl(format(ipDetect));
		parser = jsonParser(hash);
		break;
	case 'file':
		ipDetect.protocol = `file:`;
		fetcher = fetchFromFile(format(ipDetect));
		parser = splitParser(hash? JSON.parse(`'${hash}'`) : '\n');
		break;
	case 'callback':
		ipDetect.protocol = `file:`;
		fetcher = callbackFromFile(format(ipDetect));
		break;
	default:
		throw die('unknown IP_DETECT type: %s', method);
	}
	
	let auth;
	if (ipDetectAuth) {
		auth = createAuth(ipDetectAuth);
	}
	
	return async () => {
		if (auth) {
			await auth();
		}
		const strData = await fetcher();
		if (parser) {
			return parser(strData);
		} else {
			return strData;
		}
	};
}

function createAuth(cfg: Url) {
	let [_, method, http] = /^([a-z]+)\+?(.+)?:$/i.exec(cfg.protocol);
	switch (method.toLowerCase()) {
	case 'post':
	case 'get':
		if (!http) {
			http = 'http';
		}
		break;
	case 'http':
	case 'https':
		http = method;
		method = 'get';
		break;
	default:
		throw die('unknown IP_DETECT_AUTH type: %s', method);
	}
	
	cfg.protocol = http;
	const url = format(cfg);
	
	return fetchFromUrl(url, <any>method);
}
