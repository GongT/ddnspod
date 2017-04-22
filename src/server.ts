import "source-map-support/register";
import {parse} from "url";
import {getIpAddress, GetIpAddressFunc} from "./get-ip/index";
import {DnsPodApi} from "./api/index";
import {main} from "./main";

export function die(message, ...args: any[]) {
	console.error(message, ...args);
	process.exit(1);
}

// const NS = process.env.NS || 'f1g1ns1.dnspod.net/f1g1ns2.dnspod.net';
const LOGIN_TOKEN = process.env.LOGIN_TOKEN || die('please set LOGIN_TOKEN environment variable.');
const DYNAMIC_TOKEN = process.env.DYNAMIC_TOKEN || '';
const IP_DETECT = process.env.IP_DETECT || 'regexp+http://1212.ip138.com/ic.asp#/<center>(.+)<\\/center>/,/\\[(\\d+\\.\\d+\\.\\d+\\.\\d+)\\]/';
const IP_DETECT_AUTH = process.env.IP_DETECT_AUTH || '';

const ipDetect = parse(IP_DETECT, false);
const ipDetectAuth = IP_DETECT_AUTH? parse(IP_DETECT_AUTH, false) : null;
export const getAddress: GetIpAddressFunc = getIpAddress(ipDetect, ipDetectAuth);

let current: string[];
export function getCurrentAddress(): string[] {
	return current;
}

export function setCurrentAddress(s: string[]) {
	current = s;
}

export const dnsApi = new DnsPodApi({
	login_token: LOGIN_TOKEN,
	login_code: DYNAMIC_TOKEN,
});

main(process.argv.slice(2)).then(() => {
	console.log('init complete... trigger start!');
}).catch((e) => {
	console.error(e);
	die('init failed...');
});
