import {getAddress, setCurrentAddress} from "./server";
import {prepareForNames} from "./ns-search/prepare";
import {ChangeTrigger} from "./triggers/base";
import {createTrigger} from "./triggers/index";
import {parse} from "url";
import {NameStatus} from "./ns-search/name-status";
import {pushNotify} from "./notify";

const IP_CHANGE = process.env.IP_CHANGE || 'interval:?minutes=5';
const ipChange = parse(IP_CHANGE, true);

export async function main(domains: string[]) {
	const curr = await getAddress();
	setCurrentAddress(curr);
	
	const names: NameStatus[] = await prepareForNames(domains);
	
	const trigger: ChangeTrigger = createTrigger(ipChange, getAddress);
	trigger.on(async (add: string[], remove: string[]) => {
		console.log('trigger.');
		const modify: any = {};
		const realRemove = remove.filter((ip, index) => {
			const mod = !!add[index];
			if (mod) {
				modify[ip] = add[index];
				return false;
			}
			return true;
		});
		
		let realAdd: string[] = [];
		if (add.length > remove.length) {
			realAdd = add.slice(remove.length);
		}
		
		console.log('  modify: %s.', JSON.stringify(modify));
		console.log('  add: %s.', realAdd);
		console.log('  delete: %s.', realRemove);
		
		let changed = false;
		for (let name of names) {
			if (remove.length && add.length) {
				await name.update(modify);
				changed = true;
			} else {
				console.log('  nothing to modify.');
			}
			if (realRemove.length) {
				await name.remove(realRemove);
				changed = true;
			} else {
				console.log('  nothing to remove.');
			}
			if (realAdd.length) {
				await name.add(realAdd);
				changed = true;
			} else {
				console.log('  nothing to add.');
			}
		}
		console.log('trigger complete.');
		if (changed) {
			pushNotify();
		}
	});
	trigger.start();
}


