import {Url} from "url";
import {die, getCurrentAddress} from "../server";
import {TimerTrigger} from "./interval";
import {ChangeTrigger} from "./base";
import {GetIpAddressFunc} from "../get-ip/index";

export class AddressChangeTrigger extends ChangeTrigger {
	protected _start() {
	}
	
	protected _stop() {
	}
	
	public change(diff: {add: string[], remove: string[]}) {
		this.trigger(diff);
	}
}

export function createTrigger(url: Url, addressGetter: GetIpAddressFunc): ChangeTrigger {
	const type = url.protocol.replace(/:$/, '').toLowerCase();
	let pump: ChangeTrigger;
	switch (type) {
	case 'interval':
		pump = new TimerTrigger(url.query);
		break;
	default:
		throw die('unknown tirgger type: %s', url.protocol);
	}
	
	const ret = new AddressChangeTrigger();
	ret.start();
	
	pump.on(async () => {
		const diff = array_diff(getCurrentAddress(), await addressGetter());
		
		if (diff.add.length || diff.remove.length) {
			ret.change(diff);
		}
	});
	
	return ret;
}

export function array_diff(a: string[], b: string[]) {
	const add = [];
	const remove = [];
	b.forEach((item) => {
		if (a.indexOf(item) === -1) {
			add.push(item);
		}
	});
	a.forEach((item) => {
		if (b.indexOf(item) === -1) {
			remove.push(item);
		}
	});
	return {add, remove};
}
