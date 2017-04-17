import {ERecordType, RecordInfo} from "../grab-info/types";
import {dnsApi} from "../../server";
import {getDomainInfo, parseBaseDomain, parseRecordInfo, parseSubDomain} from "../grab-info/get-init-info";
import {updateAlive} from "./update-alive";

export async function createNew(ips: string[], domain_name: string, type: ERecordType): Promise<RecordInfo[]> {
	const ret: RecordInfo[] = [];
	console.log('create %s record: %s -> %s', ERecordType[type], domain_name, ips);
	for (let ip of ips) {
		const domain = await getDomainInfo(parseBaseDomain(domain_name));
		const opt = {
			domain_id: domain.id,
			sub_domain: parseSubDomain(domain_name),
			record_type: ERecordType[type],
			record_line: '默认',
			value: ip,
			mx: type === ERecordType.MX? 20 : undefined,
		};
		console.log('  creating %s', ip);
		console.log('    ', JSON.stringify(opt, null, 2).replace(/\n/g, '\n    '));
		const {record: _record} = await dnsApi.recordCreate(opt);
		console.log('    response: %j', _record);
		const {record} = await dnsApi.recordInfo({
			domain_id: domain.id,
			record_id: _record.id,
		});
		Object.assign(record, _record);
		
		const rec = parseRecordInfo(domain, record);
		await updateAlive([rec]);
		
		ret.push(rec);
		console.log('  complete.')
	}
	return ret;
}
