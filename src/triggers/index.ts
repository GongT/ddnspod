import {Url} from "url";
import {die} from "../server";
import {TimerTrigger} from "./interval";
import {ChangeTrigger} from "./base";

export function createTrigger(url: Url): ChangeTrigger {
	const type = url.protocol.replace(/:$/, '').toLowerCase();
	switch (type) {
	case 'interval':
		return new TimerTrigger(url.query);
	default:
		throw die('unknown tirgger type: %s', url.protocol);
	}
}
