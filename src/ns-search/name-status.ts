import {getCurrentAddress} from "../server";
import {getInitInfo} from "../api/grab-info/get-init-info";
import {ERecordType, RecordInfo} from "../api/grab-info/types";
import {updateAlive} from "../api/update-ddns/update-alive";
import {createNew} from "../api/update-ddns/create-new";
import {deleteRecord} from "../api/update-ddns/delete-record";
import {updateRecord} from "../api/update-ddns/update-record";

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
	
	async update(ipMap: {[old: string]: string}) {
		console.log('update(): ');
		this.originalRecords = await getInitInfo(this.host, this.type);
		for (let record of this.records) {
			await updateAlive([record]);
			const value = ipMap[record.value];
			if (!value) {
				continue;
			}
			console.log('  record %s', record.type);
			if (record.value !== value) {
				console.log('  updating: %s -> %s', record.value, value);
				await updateRecord(record, value);
				record.value = value;
			}
		}
		console.log('update() complete!');
	}
	
	async remove(ips: string[]) {
		console.log('update(%s): ', ips);
		const willDelete = this.records.filter((record) => {
			return ips.indexOf(record.value) === -1;
		});
		await deleteRecord(willDelete);
		this.records = this.records.filter((record) => {
			return ips.indexOf(record.value) !== -1;
		});
		console.log('remove() complete!');
	}
	
	async add(ips: string[]) {
		if (ips.length) {
			console.log('  create %s records:', ips.length);
			this.records = this.records.concat(await createNew(ips, this.host, this.type));
		} else {
			console.log('  nothing to create');
		}
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
		
		await this.add(nonExists);
		
		this.originalRecords = [];
		console.log('init query success: %s (%s)', this.host, ERecordType[this.type]);
		console.log('')
	}
}
