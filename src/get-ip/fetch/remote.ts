import {Fetcher} from "../index";
import request = require("request-promise-native");

export function fetchFromUrl(url: string, method: 'get'|'post' = 'get'): Fetcher {
	return () => {
		console.log('request: ', url);
		const p = <any>request(url, {
			method: method,
			/*auth: {
				sendImmediately: false,
			},*/
		});
		p.then((data) => {
			console.log('request success.');
		}, (e) => {
			console.log('request failed: %s.', e.message);
		});
		return p;
	};
}
