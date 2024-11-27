import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { json } from '@sveltejs/kit';
import { findCardByID } from '../pokemon-api-cache/api-cache';


/**
 * Returns the gym leader details
 */
export async function GET() {
	return json({
		mistyParty: [
			await findCardByID('base1-65'), // Staryu 20/40
			await findCardByID('base1-59'), // Poliwag 10+/40
			await findCardByID('base1-64'), // Starmie 20/60
		],
		surgeParty: [
			await findCardByID('base1-67'), // Voltorb 10/40
			await findCardByID('base1-20'), // Electabuzz 30+/70
			await findCardByID('base1-21'), // Electrode 50/80
			await findCardByID('base1-14'), // Raichu 60/80
		],
		blaineParty: [
			await findCardByID('base1-60'), // Ponyta 30/40 
			await findCardByID('base1-36'), // Magmar 50/50
			await findCardByID('base1-46'), // Charmander 50/80
			await findCardByID('base1-12'), // Ninetails 80/80
		]
	});
}
