import {die} from "../server";
import {ERecordType} from "../api/grab-info/types";
import {NameStatus} from "./name-status";

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
