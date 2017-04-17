import {die} from "../server";
import {
	lookup,
	resolve4,
	resolve6,
	resolveCname,
	resolveMx,
	resolveTxt,
	resolveNs,
	setServers,
} from "dns";
import {ERecordType} from "api/grab-info/types";

const DEFAULT_TTL = 600;

const serverMap: {[id: string]: string[]} = {};
const cache: {[id: string]: {value: any[]; expired: number;}} = {};

async function findDnsServers(domainName: string): Promise<string[]> {
	return new Promise<any>((resolve, reject) => {
		const wrappedCallback = (err, data) => err? reject(err) : resolve(data);
		
		resolveNs(domainName, wrappedCallback);
	});
}
export async function lookupDns(hostname: string, recordType: ERecordType = ERecordType.A) {
	console.log('query dns: %s', hostname);
	hostname = hostname.replace(/\*/g, 'dns-glob-dns');
	console.log('\tnormalized hostname: %s', hostname);
	const type = ERecordType[recordType];
	console.log('\ttype: %s', type);
	if (!type) {
		throw die('dnspod do not support dns record type: ', recordType);
	}
	
	const id = `${type}:${hostname}}`;
	if (cache[id] && cache[id].expired < Date.now()) {
		console.log('ok (cached): %s', cache[id].value);
		return cache[id].value;
	}
	
	const match = /[^.]+\.[^.]+$/.exec(hostname);
	if (!match) {
		throw die('host name invalid: %s', hostname);
	}
	const domainName = match[0];
	console.log('\tdomainName: %s', domainName);
	
	let servers: string[];
	if (serverMap[domainName]) {
		servers = serverMap[domainName];
		console.log('\t\tservers (cached): %s', servers);
	} else {
		console.log('\t\ttry get ns record:');
		servers = serverMap[domainName] = await findDnsServers(domainName);
		console.log('\tservers (fetched): %s', servers);
	}
	setServers(servers);
	
	let values;
	switch (recordType) {
	case ERecordType.A:
		values = await wrap(resolve4, noop, hostname, {ttl: true});
		break;
	case ERecordType.AAAA:
		values = await wrap(resolve6, noop, hostname, {ttl: true});
		break;
	case ERecordType.CNAME:
		values = await wrap(resolveCname, addr_map, hostname);
		break;
	case ERecordType.MX:
		values = await wrap(resolveMx, mx_map, hostname);
		break;
	case ERecordType.TXT:
		values = await wrap(resolveTxt, txt_map, hostname);
		break;
	case ERecordType.NS:
		values = await wrap(resolveNs, addr_map, hostname);
		break;
	}
	
	let lowestTtl = DEFAULT_TTL;
	values = values.map(({address, ttl}) => {
		if (ttl) {
			lowestTtl = Math.min(lowestTtl, ttl);
		}
		return address;
	});
	console.log('\tttl: %s', lowestTtl);
	console.log('\tvalues: %s', values);
	
	cache[id] = {
		value: values,
		expired: Date.now() + lowestTtl * 1000,
	};
	
	console.log('ok.');
	return values;
}
function addr_map(addr) {
	return {address: addr};
}
function txt_map(content) {
	return {address: content.join('')};
}
function mx_map({exchange, priority}) {
	return {address: {exchange, priority}}
}

function noop(o) {
	return o;
}

async function wrap(fn: Function, wrap: (e: any) => any, ...args: any[]) {
	console.log('\tquery start.');
	return new Promise((resolve, reject) => {
		const wrappedCallback = (err: Error, data: any[]) => {
			console.log('\tquery complete (length = %s).', data.length);
			return (err)? reject(err) : resolve(data.map(wrap));
		};
		
		fn(...args, wrappedCallback)
	});
}
