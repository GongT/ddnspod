import {Fetcher} from "../index";
import {readFile} from "fs";

export function fetchFromFile(path: string): Fetcher {
	return () => {
		return new Promise((resolve, reject) => {
			const wrappedCallback = (err, data) => err? reject(err) : resolve(data);
			readFile(path, wrappedCallback);
		});
	};
}
