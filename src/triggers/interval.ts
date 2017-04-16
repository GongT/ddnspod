import {die} from "../server";
import {ChangeTrigger} from "./base";

export class TimerTrigger extends ChangeTrigger {
	private timer: NodeJS.Timer;
	private interval: number;
	
	constructor(params: {minutes: string, seconds: string}) {
		super();
		params = Object.assign({}, params);
		const minutes = parseInt(params.minutes) || 0;
		let seconds = parseInt(params.seconds) || 0;
		seconds += minutes * 60;
		if (seconds < 5) {
			throw die("interval trigger: timer value can not smaller than 5 seconds");
		}
		this.interval = seconds * 1000;
		
		delete params.seconds;
		delete params.minutes;
		if (Object.keys(params).length > 0) {
			throw die('unknown extra trigger params: %s', Object.keys(params).join(', '));
		}
	}
	
	protected _start() {
		this.timer = setInterval(() => {
			this.trigger();
		}, this.interval);
	}
	
	protected _stop() {
		clearInterval(this.timer);
	}
}
