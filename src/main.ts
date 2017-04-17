import {getAddress, getCurrentAddress, setCurrentAddress, trigger} from "./server";
import {NameStatus, prepareForNames} from "./ns-search/prepare";

export async function main(domains: string[]) {
	const curr = await getAddress();
	setCurrentAddress(curr);
	
	const names: NameStatus[] = await prepareForNames(domains);
	
	trigger.on(async () => {
		// const move = array_diff(address, current);
		setCurrentAddress(await getAddress());
		
		for (let name of names) {
			await name.update();
		}
	});
}


