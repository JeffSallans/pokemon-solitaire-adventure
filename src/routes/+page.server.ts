import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import type { PageServerLoad } from './solitaire/$types';
import { generatePack } from './solitaire/solitaire-pack';

export async function load(): Promise<PageServerLoad> {
	
	const packs = [
		(await generatePack('base1')),
		(await generatePack('base1')),
		(await generatePack('base1'))
	];

	return {
		packs,
		mistyParty: [
			await PokemonTCG.findCardByID('base1-65'), // Staryu
			await PokemonTCG.findCardByID('base1-59'), // Poliwag
			await PokemonTCG.findCardByID('base1-64'), // Starmie 
		],
		ericaParty: [
			await PokemonTCG.findCardByID('base1-65'), // Staryu
			await PokemonTCG.findCardByID('base1-59'), // Poliwag
			await PokemonTCG.findCardByID('base1-64'), // Starmie 
		],
		giovanniParty: [
			await PokemonTCG.findCardByID('base1-65'), // Staryu
			await PokemonTCG.findCardByID('base1-59'), // Poliwag
			await PokemonTCG.findCardByID('base1-64'), // Starmie 
		]
	};
};

