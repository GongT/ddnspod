import {Parser} from "../index";
export function splitParser(char: string): Parser {
	return (s) => {
		return s.split(new RegExp(char, 'g'));
	};
}
