import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import type { PageServerLoad } from './solitaire/$types';
import { generatePack } from './solitaire/solitaire-pack';

export async function load(): Promise<PageServerLoad> {
	
	const packs = [
		(await generatePack('base1')),
		(await generatePack('base1'))
		//(await generatePack('base1'))
	];

	return {
		packs,
		mistyParty: [
			await PokemonTCG.findCardByID('base1-65'), // Staryu 20/40
			await PokemonTCG.findCardByID('base1-59'), // Poliwag 10+/40
			await PokemonTCG.findCardByID('base1-64'), // Starmie 20/60
		],
		surgeParty: [
			await PokemonTCG.findCardByID('base1-67'), // Voltorb 10/40
			await PokemonTCG.findCardByID('base1-20'), // Electabuzz 30+/70
			await PokemonTCG.findCardByID('base1-21'), // Electrode 50/80
			await PokemonTCG.findCardByID('base1-14'), // Raichu 60/80
		],
		blaneParty: [
			await PokemonTCG.findCardByID('base1-60'), // Ponyta 30/40 
			await PokemonTCG.findCardByID('base1-36'), // Magmar 50/50
			await PokemonTCG.findCardByID('base1-12'), // Ninetails 80/80
			await PokemonTCG.findCardByID('base1-23'), // Arcanine 80-/100
		]
	};
};

