import "source-map-support/register";
import {parse, format} from "url";
import {getIpAddress} from "./get-ip/index";
import {createTrigger} from "./triggers/index";

export function die(message, ...args: any[]) {
	console.error(message, ...args);
	process.exit(1);
}

const NS = process.env.NS || 'f1g1ns1.dnspod.net/f1g1ns2.dnspod.net';
const nsServers = NS.split('/');
const LOGIN_TOKEN = process.env.LOGIN_TOKEN || die('please set LOGIN_TOKEN environment variable.');
const DYNAMIC_TOKEN = process.env.DYNAMIC_TOKEN || '';
const IP_DETECT = process.env.IP_DETECT || 'regexp+http://1212.ip138.com/ic.asp#/<center>(.+)<\\/center>/,/\\[(\\d+\\.\\d+\\.\\d+\\.\\d+)\\]/';
const IP_DETECT_AUTH = process.env.IP_DETECT_AUTH || '';
const IP_CHANGE = process.env.IP_CHANGE || 'interval:?minutes=5';

const ipDetect = parse(IP_DETECT, false);
const ipDetectAuth = IP_DETECT_AUTH? parse(IP_DETECT_AUTH, false) : null;

const ipChange = parse(IP_CHANGE, true);

/*
 const getter = getIpAddress(ipDetect, ipDetectAuth);
 
 getter().then((data) => {
 console.log(require('util').inspect(data, {colors: true}));
 }, (e) => {
 console.error(e);
 })
 */

const trigger = createTrigger(ipChange);
trigger.on(() => {
	console.log('ip changed, start detect');
});
trigger.start();
