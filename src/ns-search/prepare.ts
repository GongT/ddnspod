import {die, dnsApi, getCurrentAddress} from "../server";
import {lookupDns} from "./index";
import {getInitInfo, parseBaseDomain, parseSubDomain, getRecordsCached} from "../api/grab-info/get-init-info";
import {ERecordType, RecordInfo} from "../api/grab-info/types";
import {updateAlive} from "../api/update-ddns/update-alive";
import {createNew} from "../api/update-ddns/create-new";
import {deleteRecord} from "../api/update-ddns/delete-record";

export class NameStatus {
	host: string;
	type: ERecordType;
	records: RecordInfo[] = [];
	originalRecords: RecordInfo[] = [];
	
	defaultTtl: number = 600;
	
	constructor(host, type: ERecordType) {
		this.host = host;
		this.type = type;
	}
	
	async update() {
	
	}
	
	async init(): Promise<void> {
		this.originalRecords = await getInitInfo(this.host, this.type);
		
		const ips = getCurrentAddress();
		
		// get some reuse-able records
		this.records = this.originalRecords.filter((record) => {
			return ips.indexOf(record.value) !== -1;
		});
		
		// delete these records, FIXME: race condition with other ddns client
		const outdate = this.originalRecords.filter((record) => {
			return ips.indexOf(record.value) === -1;
		}).filter((record) => {
			return Date.now() - record.alive.getTime() > 3600 * 1000;
		});
		
		// find not exists records
		const exists = this.records.map((e) => e.value);
		const nonExists = ips.filter((ip) => {
			return exists.indexOf(ip) === -1;
		});
		
		if (this.records.length) {
			await updateAlive(this.records);
		}
		
		if (outdate.length) {
			await deleteRecord(outdate);
		}
		
		if (nonExists.length) {
			this.records = this.records.concat(await createNew(nonExists, this.host, this.type));
		}
		this.originalRecords = [];
	}
}

export async function prepareForNames(names: string[]) {
	console.log('prepare runtime data:');
	const nameStatus: NameStatus[] = [];
	for (let name of names) {
		let [host, type] = name.split(/:/);
		type = type? type.toUpperCase() : 'A';
		
		if (!ERecordType.hasOwnProperty(type)) {
			throw die('dnspod do not support dns record type: ', type);
		}
		
		const item = new NameStatus(host, ERecordType[type]);
		await item.init();
		console.log('init query success: %s -> %s', name, item.records.map(e => e.name));
		
		nameStatus.push(item);
	}
	
	console.log('prepare complete!');
	return nameStatus;
}
