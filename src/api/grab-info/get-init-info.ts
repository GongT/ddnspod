import {die, dnsApi, getCurrentAddress} from "../../server";
import {DomainInfo, DomainInfoWithRecords, ERecordType, RecordInfo} from "../grab-info/types";
import {existsSync, mkdirSync, readFileSync, writeFileSync} from "fs";

const selfId: string = (() => {
	const FILE = '/mnt/id.txt';
	if (existsSync(FILE)) {
		return readFileSync(FILE, 'utf8');
	} else {
		const id = (Math.random() * 10000000).toFixed(0) + (Date.now() / 1000).toFixed(0);
		writeFileSync(FILE, id, 'utf8');
		return id;
	}
})();

if (!existsSync('/mnt/cache')) {
	mkdirSync('/mnt/cache');
}

function fetchFileCache(id: string) {
	const FILE = `/mnt/cache/${id}.json`;
	if (cache[id]) {
		return cache[id][0] > Date.now();
	} else if (existsSync(FILE)) {
		const ret = require(FILE);
		if (ret[0] > Date.now()) {
			cache[id] = ret;
			return true;
		}
	}
}

function writeFileCache(id: string, value: any) {
	const FILE = `/mnt/cache/${id}.txt`;
	cache[id] = [Date.now() + 3600 * 1000, value];
	writeFileSync(FILE, JSON.stringify(cache[id]), 'utf8');
}

interface KV<T> {
	[id: string]: T
}
const cache: KV<[number, DomainInfoWithRecords]> = {};

export async function getInitInfo(record: string, rec_type: ERecordType): Promise<RecordInfo[]> {
	const domain = parseBaseDomain(record);
	const {list} = await getRecordsCached(domain);
	const sub = parseSubDomain(record);
	
	return list.filter(({name, type}) => {
		return name === sub && type === rec_type;
	});
}

export function parseBaseDomain(host: string) {
	const match = /[^.]+\.[^.]+$/.exec(host);
	if (!match) {
		throw die('host name invalid: %s', host);
	}
	return match[0];
}

export function parseSubDomain(host: string) {
	return host.replace(parseBaseDomain(host), '').replace(/\.$/, '') || '@';
}

export async function getDomainInfo(domain: string): Promise<DomainInfo> {
	return (cache[domain] && cache[domain][1]) || getRecordsCached(domain);
}

export async function getRecordsCached(domain: string): Promise<DomainInfoWithRecords> {
	const id = domain;
	if (fetchFileCache(id)) {
		return cache[id][1];
	}
	
	console.log('fetch new domain info: ', domain);
	const ret: DomainInfoWithRecords = <any> {};
	
	const data = await dnsApi.recordList({
		domain: domain,
		length: 1000
	});
	
	ret.id = data.domain.id;
	ret.name = data.domain.name;
	ret.ttl = parseInt(data.domain.min_ttl);
	ret.ns = data.domain.dnspod_ns;
	ret.list = data.records.map((raw) => parseRecordInfo(ret, raw));
	
	console.log('  id: ', ret.id);
	console.log('  name: ', ret.name);
	console.log('  ns: ', ret.ns);
	console.log('  records: ', ret.list.length);
	
	writeFileCache(id, ret);
	return ret;
}

export function encodeRemarkPrefix() {
	return `[ddns:${(Date.now() / 1000).toFixed(0)},${selfId}] `;
}

const ddnsMark = /\[ddns:(\d+),(\d+)]/g;
export function parseRecordInfo(domain: DomainInfo, raw) {
	const match = ddnsMark.exec(raw.remark || '');
	let alive: Date;
	if (match) {
		alive = new Date(parseInt(match[1]) * 1000)
	} else {
		alive = new Date(0);
	}
	const domainInfo = {
		domain_id: parseInt(domain.id),
		base: domain.name,
	};
	return <RecordInfo>Object.assign({
		id: parseInt(raw.id),
		value: raw.value.replace(/^\.|\.$/g, ''),
		enabled: 0 !== parseInt(raw.enabled),
		updated_on: new Date(raw.updated_on),
		name: raw.name || raw.sub_domain,
		line_id: raw.line_id || raw.record_line_id,
		type: <any>ERecordType[(raw.type || raw.record_type).toUpperCase()],
		remark: (raw.remark || '').replace(ddnsMark, '').trim(),
		mx: parseInt(raw.mx),
		alive,
	}, domainInfo);
}
