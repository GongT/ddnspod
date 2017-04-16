import {Parser} from "../index";
import {die} from "../../server";
export function regexpParser(regstr: string): Parser {
	const regstack: RegExp[] = regstr.split(/,\s*\//).map((s, i) => {
		let regStr;
		
		if (i === 0) {
			regStr = s.substr(1);
		} else {
			regStr = s;
			s = '/' + s;
		}
		const rMatch = /\/([a-z]*)$/.exec(regStr);
		if (!rMatch) {
			throw die('not valid regexp: %s', s);
		}
		
		const mod = rMatch[1].toLowerCase();
		regStr = regStr.replace(/\/([a-z]*)$/, '');
		
		let reg;
		try {
			reg = new RegExp(regStr, mod.indexOf('g') === -1? `${mod}g` : mod);
		} catch (e) {
			throw die('not valid regexp: %s - %s', s, e.message);
		}
		
		if (!(reg instanceof RegExp)) {
			throw die('not valid regexp: %s', s);
		}
		return reg;
	});
	
	return (s) => {
		// console.info('parse: ', s);
		let data: string[] = Array.isArray(s)? s : [s];
		regstack.every((reg) => {
			// console.info('stage: ', reg);
			
			data = data.map((s) => {
				return matchAll(reg, s);
			}).reduce((p, c) => {
				// console.info('concat: ', c);
				return p.concat(c);
			}, []);
			
			// console.info('stage result: ', data);
			return data.length > 0;
		});
		return data;
	};
}

function matchAll(reg: RegExp, str: string): string[] {
	const ret = [];
	let match;
	// console.info('try: ', str);
	while (match = reg.exec(str)) {
		if (!match[1]) {
			throw die('no match group 1 in regexp: %s\n\t%j', reg, match);
		}
		// console.info('push: ', match[1]);
		ret.push(match[1]);
	}
	// console.info('ret: ', ret);
	return ret;
}
