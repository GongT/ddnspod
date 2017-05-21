import {getCurrentAddress} from "./server";
import * as request from "request";
import {RequestResponse} from "request";

const IP_CHANGE_NOTIFY = process.env.IP_CHANGE_NOTIFY || '';
let i: NodeJS.Timer = null;
export function pushNotify() {
	if (!IP_CHANGE_NOTIFY) {
		return;
	}
	if (!i) {
		i = setTimeout(() => {
			i = null;
			const body = {
				currentIp: getCurrentAddress()
			};
			console.log('sending notify to %s', IP_CHANGE_NOTIFY)
			request.post(IP_CHANGE_NOTIFY, {
				body: body,
				json: true,
			}, (error: any, response: RequestResponse, body: any) => {
				if (error) {
					console.error('=========================\nERROR - notify failed');
					console.error(' message: ', error.message);
					console.error(' http: %s %s', response? response.statusCode : 'NaN', response? response.statusMessage : '');
					console.error(' request: %s', IP_CHANGE_NOTIFY);
					console.error(' body: %s', JSON.stringify(body));
					console.error('=========================');
				} else {
					console.log('notify sent.');
					console.log('result: ', body);
				}
			});
		}, 0);
	}
}
