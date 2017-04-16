import {Fetcher} from "../index";
import {die} from "../../server";

export function callbackFromFile(path: string): Fetcher {
	let func;
	try {
		func = require(path).default;
		if (typeof func !== 'function') {
			die('default export not function in path: %s', path);
		}
	} catch (e) {
		throw die('cannot found module with default export in path: %s', path);
	}
	return () => {
		const data = func();
		if (Array.isArray(data) && (data.length === 0 || typeof data[0] === 'string' )) {
			return <any>data;
		}
		console.error('custom fetch callback not return array of strings.');
		return Promise.reject(new Error('return fail'));
	};
}
