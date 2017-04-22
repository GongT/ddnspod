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
		
		console.log('');
		console.log('init query for %s (%s):', this.host, ERecordType[this.type]);
		this.originalRecords.forEach((record) => {
			console.log('    -> %s', record.value);
		});
		
		const ips = getCurrentAddress();
		
		// get some reuse-able records
		this.records = this.originalRecords.filter((record) => {
			return ips.indexOf(record.value) !== -1;
		});
		
		// delete these records, FIXME: race condition with other ddns client
		const outdate = this.originalRecords.filter((record) => {
			return ips.indexOf(record.value) === -1;
		}).filter((record) => {
			// TODO
			return Date.now() - record.alive.getTime() > 3600 * 1000;
		});
		
		// find not exists records
		const exists = this.records.map((e) => e.value);
		const nonExists = ips.filter((ip) => {
			return exists.indexOf(ip) === -1;
		});
		
		if (this.records.length) {
			console.log('  update %s records:', this.records.length);
			await updateAlive(this.records);
		} else {
			console.log('  nothing to update');
		}
		
		if (outdate.length) {
			console.log('  delete %s records:', outdate.length);
			await deleteRecord(outdate);
		} else {
			console.log('  nothing to delete');
		}
		
		if (nonExists.length) {
			console.log('  create %s records:', nonExists.length);
			this.records = this.records.concat(await createNew(nonExists, this.host, this.type));
		} else {
			console.log('  nothing to create');
		}
		this.originalRecords = [];
		
		console.log('init query success: %s:%s -> %s', this.host, ERecordType[this.type], this.records.map(e => e.name));
	}
}

export async function prepareForNames(names: string[]) {
	console.log('prepare runtime data:');
	const nameStatus: NameStatus[] = [];
	for (let name of names) {
		let [host, typeName] = name.split(/:/);
		typeName = typeName? typeName.toUpperCase() : 'A';
		
		if (!ERecordType.hasOwnProperty(typeName)) {
			throw die('dnspod do not support dns record type: ', typeName);
		}
		
		const item = new NameStatus(host, ERecordType[typeName]);
		await item.init();
		
		nameStatus.push(item);
	}
	
	console.log('prepare complete!');
	return nameStatus;
}
