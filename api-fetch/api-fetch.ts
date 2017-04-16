import * as request from "request-promise-native";
import {tmpdir} from 'os';
import {resolve, basename} from 'path';
import {mkdirSync, existsSync, readFileSync, writeFileSync} from 'fs'
import {createHash} from "crypto";
import {load} from "cheerio";

console.log('start generate.');

const BASE_URL = 'https://www.dnspod.cn/docs/';
const API_BASE = 'https://dnsapi.cn/';

const regTopLevel = / href="(.+?\.html)"/g;
const regOr = /\s*或\s*/g;

const statusPatten = /{\s*code:\s*string;\n\s*message:\s*string;\n\s*created_at:\s*string;\n\s*}/;

const TARGET = resolve(__dirname, '../src/api/index.ts');

interface ApiDefine {
	id: string;
	documentUrl: string;
	
	url: string;
	name: string;
	clsName: string;
	method: string;
	paramsDesc: {[name: string]: string};
	example?: any;
}
interface ApiMap {
	[name: string]: ApiDefine
}

async function getSub(docUrl: string): Promise<ApiMap> {
	const apiMap: ApiMap = {};
	const data = await cachedGet(docUrl);
	const $ = load(data, {});
	
	console.log('parse data from: %s', basename(docUrl));
	$('div.body div.section[id]').each((i, e) => {
		const id = $(e).attr('id');
		const ret: ApiDefine = {
			id: id,
			documentUrl: `${docUrl}#${id}`,
			url: "",
			name: "",
			clsName: "",
			method: "POST",
			paramsDesc: {},
		};
		
		const $section = $(e);
		if ($section.find('div.section[id]').length) {
			console.log('  %s - skip.', ret.id);
			return;
		}
		const $a = $section.find(`> dl.docutils a.reference.external[href^="${API_BASE}"]`);
		if (!$a.length) {
			console.log('  %s - skip.', ret.id);
			return;
		}
		console.log('  %s: ', ret.id);
		
		$section.find('dl.docutils > dt').each((i, e) => {
			const $line = $(e);
			const text = $line.text();
			if (/接口地址/.test(text)) {
				ret.url = $line.next().find('a.external').text().trim();
			} else if (/HTTP请求方式/.test(text)) {
				ret.method = $line.next().find('li').text().trim();
				console.log('    method: %s', ret.method);
			} else if (/请求参数/.test(text)) {
				if ($line.next().find('>table.docutils').length) {
					Object.assign(ret.paramsDesc, parseArgumentDescriptionTable($, $line.next().find('>table.docutils')));
				} else {
					$line.next().find('li').each((i, li) => {
						Object.assign(ret.paramsDesc, parseArgumentDescription($(li).text()));
					});
				}
				console.log('    arguments: %j', ret.paramsDesc);
			}
		});
		
		if (!ret.url) {
			throw new Error('    can not generate: url not found.');
		}
		
		const name = ret.url.replace(API_BASE, '').replace(/\./g, '');
		ret.clsName = name.replace(/^[a-z]/, (s) => s.toUpperCase());
		ret.name = name.replace(/^[A-Z]/, (s) => s.toLowerCase());
		console.log('    name: %s', ret.name);
		console.log('    source: %s', ret.url);
		
		const $ret_example = $section.find('blockquote .highlight pre');
		if ($ret_example.length) {
			const ret_json = $ret_example.text();
			try {
				ret.example = JSON.parse(ret_json);
			} catch (e) {
				console.error('    can not parse example json');
			}
		}
		
		apiMap[ret.name] = ret;
	});
	
	return apiMap;
}

function parseArgumentDescriptionTable($: CheerioStatic, $table: Cheerio) {
	const paramsDesc = {};
	$table.find('tbody>tr').each((i, row) => {
		const names = $(row).find('>td:first-child').text();
		if (/公共参数/.test(names)) {
			return;
		}
		const alias = names.split(regOr);
		const description = $(row).find('>td:last-child').text();
		alias.forEach((name) => {
			name = name.trim();
			if (paramsDesc[name]) {
				paramsDesc[name] += ' ' + description.trim();
			} else {
				paramsDesc[name] = description.trim();
			}
		});
	});
	return paramsDesc;
}

function parseArgumentDescription(paramLine: string) {
	if (!/^[a-zA-Z]/.test(paramLine)) {
		return {};
	}
	
	const paramsDesc = {};
	
	const parts = paramLine.split(regOr);
	const descFrom = parts.findIndex((part) => {
		return /[,，\s:：]/.test(part);
	});
	if (descFrom !== -1) {
		const center = parts[descFrom].split(/[,，\s:：]/);
		parts.splice(descFrom, 1, ...center);
		const alias = parts.slice(0, descFrom + 1);
		const description = parts.slice(descFrom + 1).map(e => e.trim()).join('，');
		alias.forEach((name) => {
			name = name.trim();
			if (paramsDesc[name]) {
				paramsDesc[name] += ' ' + description.trim();
			} else {
				paramsDesc[name] = description.trim();
			}
		});
	} else if (parts.length === 0) {
		paramsDesc[parts[0].trim()] = 'no description';
	} else {
		throw new TypeError('can not parse this line');
	}
	return paramsDesc;
}

function md5(str: string) {
	return createHash("md5").update(str, 'utf8').digest('hex');
}

const tempDir = resolve('/tmp', 'dnspod-api-temp');
if (!existsSync(tempDir)) {
	console.log('create temp dir: %s', tempDir);
	mkdirSync(tempDir);
}

async function cachedGet(url: string): Promise<string> {
	console.log('get request: %s', url);
	const cached = resolve(tempDir, md5(url) + '.html');
	if (existsSync(cached)) {
		console.log('  read from cached file: %s', cached);
		return readFileSync(cached, 'utf8');
	}
	const data = await request.get(url);
	
	console.log('  got response');
	writeFileSync(cached, data, 'utf8');
	
	await new Promise((resolve) => {
		setTimeout(resolve, 1000);
	});
	
	return data;
}

function generate(def: ApiDefine): [string, string] {
	const input = `export interface I${def.clsName}Params {
	${Object.keys(def.paramsDesc).map((key) => {
		return `${key}?: any; /* ${def.paramsDesc[key].replace(/\*/g, '＊')} */`
	}).join('\n\t')}
}`;
	const output = `export interface I${def.clsName}Return ${detectJsonStructure(def.example)}`;
	
	const func = `/**
 * @document ${def.documentUrl}
 */
public ${def.name}(params: I${def.clsName}Params = <any>{}): Promise<I${def.clsName}Return> {
	return this._request("${def.url}","${def.method}",params);
}`;
	
	return [input + '\n' + output, func];
}

async function main() {
	const data: string = await cachedGet(`${BASE_URL}index.html`);
	let match;
	const same = {};
	const apiMap = {};
	while (match = regTopLevel.exec(data)) {
		const subUrl = `${BASE_URL}${match[1]}`;
		if (same[subUrl]) {
			continue;
		}
		same[subUrl] = true;
		Object.assign(apiMap, await getSub(subUrl));
		console.log('');
	}
	
	let methods = '\t';
	let interfaces = '';
	Object.values<ApiDefine>(apiMap).forEach((apiDef) => {
		const ret = generate(apiDef);
		interfaces += ret[0] + '\n\n';
		methods += ret[1] + '\n\n';
	});
	
	return `import {DnsPodApiBase} from "./base";
export interface IStatusReturn {
	code: string;
	message: string;
	created_at: string;
}

${interfaces}
	
export class DnsPodApi extends DnsPodApiBase {
${methods.replace(/\n/g, '\n\t')}
}`
}

setImmediate(() => {
	main().then((data) => {
		writeFileSync(TARGET, data, 'utf8');
		console.log('generate complete.');
		process.exit(0);
	}, (e) => {
		console.error(e);
		process.exit(1);
	});
});

function detectJsonStructure(obj) {
	if (!obj) {
		return '{ [key: string]: any; }'
	}
	
	return `{
	${Object.keys(obj).map((key) => {
		const guess = detectSubType(obj[key]).replace(/\n/g, '\n\t').replace(statusPatten, 'IStatusReturn');
		return `${key}: ${guess};`;
	}).join('\n\t')}
}`;
}

function detectSubType(value) {
	const type = typeof value;
	if (type === 'object') {
		if (Array.isArray(value)) {
			return detectSubType(value[0]);
		} else {
			return detectJsonStructure(value);
		}
	} else {
		return type;
	}
}
