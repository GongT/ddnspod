import {Parser} from "../index";
export function jsonParser(path: string): Parser {
	const fns: Function[] = splitPath(path);
	return (s) => {
		let data;
		try {
			data = JSON.parse(s);
		} catch (e) {
			console.error('not a valid json string: ' + s);
			return [];
		}
		for (let i = 0; i < fns.length; i++) {
			data = fns[i](data);
			// console.log('ret= %j', data);
		}
		
		return data;
	};
}

function splitPath(str: string) {
	// console.log(str)
	const protect = [];
	str = str.replace(/\$(\[.+=".+?"])+/, (_) => {
		const id = `__${Math.random()}__`;
		protect.push([id, _]);
		return id;
	});
	const arr = str.split(/\./g).map((s) => {
		protect.forEach(([id, repl]) => {
			s = s.replace(id, repl);
		});
		return s;
	});
	
	return arr.map((getter) => {
		// console.log(getter)
		if (getter.indexOf('$') !== 0) {
			return getSimple(getter);
		} else {
			return getArray(getter.substr(1));
		}
	});
}
function getSimple(part) {
	return (data) => {
		// console.log('get simple :%s:', part);
		if (Array.isArray(data)) {
			return data.map(item => item[part]).filter(item => !!item);
		} else if (data) {
			return data[part];
		} else {
			return;
		}
	}
}
function getArray(filter?: string) {
	const filters = [];
	if (filter) {
		let match;
		const r = /\[(.+?)=(".+"|\d+)]/g;
		while (match = r.exec(filter)) {
			filters.push([match[1], JSON.parse(match[2])]);
		}
	}
	
	return function getArrayFunc(data: Object) {
		// console.log('get array :%s:', filter);
		if (Array.isArray(data)) {
			return data.map(getArrayFunc).filter(e => !!e);
		} else if (!data) {
			return;
		}
		
		if (filter) {
			const ok = filters.every(([key, value]) => {
				// console.log(`${key}: ${data[key]} == ${value}`);
				return data[key] == value;
			});
			// console.log(ok);
			if (!ok) {
				return null;
			}
		}
		return data;
	}
}
