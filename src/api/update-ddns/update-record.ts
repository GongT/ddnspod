import {ERecordType, RecordInfo} from "../grab-info/types";
import {dnsApi} from "../../server";

export async function updateRecord(record: RecordInfo, value: string): Promise<void> {
	await dnsApi.recordModify({
		domain_id: record.domain_id,
		record_id: record.id,
		sub_domain: record.name,
		record_type: ERecordType[record.type],
		record_line: '默认',
		value: value,
		mx: record.type === ERecordType.MX? 20 : undefined,
	});
}
