import type { PageServerLoad } from './solitaire/$types';
import { generatePack } from './solitaire/solitaire-pack';

export async function load(): Promise<PageServerLoad> {
	
	const packs = [
		(await generatePack('base1')),
		(await generatePack('base1')),
		(await generatePack('base1'))
	];

	return {
		packs
	};
};

