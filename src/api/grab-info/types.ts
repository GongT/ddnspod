export enum ERecordType{
	A,
	AAAA,
	CNAME,
	MX,
	TXT,
	NS,
}

export interface DomainInfo {
	name: string;
	id: string;
	ttl: number;
	ns: string[];
}
export interface DomainInfoWithRecords extends DomainInfo {
	list: RecordInfo[];
}
export interface RecordInfo {
	id: number;
	domain_id: number;
	value: string;
	enabled: boolean;
	updated_on: Date;
	alive: Date;
	name: string;
	base: string;
	line_id: string;
	type: ERecordType;
	remark: string;
	mx: number;
}
