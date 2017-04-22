import {Url} from "url";
import {die, getCurrentAddress, setCurrentAddress} from "../server";
import {TimerTrigger} from "./interval";
import {ChangeTrigger} from "./base";
import {GetIpAddressFunc} from "../get-ip/index";

export class AddressChangeTrigger extends ChangeTrigger {
	constructor(private addressGetter: GetIpAddressFunc) {
		super();
	}
	
	protected _start() {
	}
	
	protected _stop() {
	}
	
	public async checkChange() {
		const newAddress = await this.addressGetter();
		const {add, remove} = array_diff(getCurrentAddress(), newAddress);
		
		if (add.length || remove.length) {
			console.log('');
			console.log('change trigger emit: not changed.');
			console.log('  current: %s', getCurrentAddress());
			console.log('  new: %s', newAddress);
			console.log('  add: %s', add);
			console.log('  remove: %s', remove);
			return new Promise((resolve, reject) => {
				setImmediate(resolve);
			}).then(() => {
				console.log('change trigger complete.');
				console.log('');
				return this.trigger(add, remove);
			}).then(() => {
				setCurrentAddress(newAddress);
			}).catch(() => {
			});
		} else {
			return null;
		}
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
		throw die('unknown trigger type: %s', url.protocol);
	}
	
	const ret = new AddressChangeTrigger(addressGetter);
	ret.start();
	
	pump.on(async () => {
		const changed = await ret.checkChange();
		if (!changed && process.stdout.isTTY) {
			console.log('change trigger emit: not changed.');
		}
	});
	
	['start', 'stop'].forEach((n) => {
		ret[n] = pump[n].bind(pump);
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
