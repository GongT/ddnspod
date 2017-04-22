import {RecordInfo} from "../grab-info/types";
import {dnsApi} from "../../server";

export async function deleteRecord(records: RecordInfo[]): Promise<void> {
	console.log('  removing outdated %s records:', records.length);
	for (let record of records) {
		try {
			console.log('  removing: %s.%s -> %s', record.name, record.base, record.value);
			await dnsApi.recordRemove({
				domain_id: record.domain_id,
				record_id: record.id,
			});
			console.log('    complete.')
		} catch (e) {
			console.error('  remove error - %s', e.message);
		}
	}
}
