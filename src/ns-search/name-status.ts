import {getCurrentAddress} from "../server";
import {getInitInfo} from "../api/grab-info/get-init-info";
import {ERecordType, RecordInfo} from "../api/grab-info/types";
import {updateAlive} from "../api/update-ddns/update-alive";
import {createNew} from "../api/update-ddns/create-new";
import {deleteRecord} from "../api/update-ddns/delete-record";
import {updateRecord} from "../api/update-ddns/update-record";
import {pushNotify} from "../notify";

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
	
	async update(ipMap: {[old: string]: string}): Promise<number> {
		let changed = 0;
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
				changed++;
				console.log('  updating: %s -> %s', record.value, value);
				await updateRecord(record, value);
				record.value = value;
			}
		}
		console.log('update() complete!');
		if (changed > 0) {
			pushNotify();
		}
		
		return changed;
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
	
	async init(): Promise<number> {
		let changed = 0;
		this.originalRecords = await getInitInfo(this.host, this.type);
		
		console.log('');
		console.log('init query for %s (%s):', this.host, ERecordType[this.type]);
		this.originalRecords.forEach((record) => {
			console.log('    -> %s', record.value);
		});
		
		const ips = getCurrentAddress();
		console.log('my ips:', ips);
		console.log(this.originalRecords);
		
		this.records = []; // update to dated
		const reuse: RecordInfo[] = [];
		const need_update: [RecordInfo, string][] = [];
		const need_delete: RecordInfo[] = [];
		
		this.originalRecords.filter((record) => {
			const recordHit = ips.indexOf(record.value) !== -1;
			if (recordHit) {
				ips.splice(ips.indexOf(record.value), 1);
				this.records.push(record);
				reuse.push(record);
				return false;
			}
			return true;
		}).forEach((record) => {
			const recordOutDate = Date.now() - record.alive.getTime() > 3600 * 1000;
			if (recordOutDate) {
				need_delete.push(record);
			} else if (ips.length) {
				this.records.push(record);
				const ip = ips.shift();
				need_update.push([record, ip]);
				// todo: 如何确定这些记录是其他机器的，还是自己需要更新的？
			} else {
				need_delete.push(record);
			}
		});
		
		const nonExists = ips;
		console.log('  not exists records:', nonExists);
		
		if (reuse.length) {
			changed += reuse.length;
			console.log('  update %s records:', reuse.length);
			await updateAlive(reuse);
		} else {
			console.log('  nothing to update alive');
		}
		
		if (need_update.length) {
			changed += need_update.length;
			for (let [record, value] of need_update) {
				console.log('  updating: %s -> %s', record.value, value);
				await updateRecord(record, value);
			}
		} else {
			console.log('  nothing to update value');
		}
		
		if (need_delete.length) {
			changed += need_delete.length;
			console.log('  delete %s records:', need_delete.length);
			await deleteRecord(need_delete);
		} else {
			console.log('  nothing to delete');
		}
		
		if (nonExists.length) {
			changed += nonExists.length;
			console.log('  create %s records:', nonExists.length);
			this.records = this.records.concat(await createNew(nonExists, this.host, this.type));
		} else {
			console.log('  nothing to create');
		}
		
		this.originalRecords = [];
		console.log('init query success: %s (%s)', this.host, ERecordType[this.type]);
		console.log('');
		
		if (changed) {
			pushNotify();
		}
		
		return changed;
	}
}
