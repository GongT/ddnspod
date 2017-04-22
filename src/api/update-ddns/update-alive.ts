import {RecordInfo} from "../grab-info/types";
import {dnsApi} from "../../server";
import {encodeRemarkPrefix} from "../grab-info/get-init-info";

export async function updateAlive(records: RecordInfo[]): Promise<void> {
	for (let record of records) {
		if (Date.now() - record.alive.getTime() > 15 * 60 * 1000) {
			console.log('  updating alive tag for record: %s.%s', record.name, record.base);
			console.log('    now=%s, alive=%s, delta=%s', (new Date).toLocaleString(), record.alive.toLocaleString(), Date.now() - record.alive.getTime());
			await dnsApi.recordRemark({
				domain_id: record.domain_id,
				record_id: record.id,
				remark: encodeRemarkPrefix() + record.remark,
			});
			console.log('  complete.');
		}
	}
}
