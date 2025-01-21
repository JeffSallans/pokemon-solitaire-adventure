import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { json } from '@sveltejs/kit';
import { generatePack } from '../../solitaire/solitaire-pack';
import pkg from 'lodash';
import { getGymLeaderMetadata } from '../gym-leader-metadata';
const { includes, keys } = pkg;

/**
 * Generates a 11 card pokemon card pack for the given set name
 * @assuems the environment variable POKEMONTCG_API_KEY is set
 * @param setName The ID of the set to use, example base1
 * @returns 
 */
export async function GET(request: { url: { searchParams: { get: (arg0: string) => string; }; }; }) {
	let cardSet = request.url.searchParams.get('cardSet') || '';	
	
	let cleanCardSet = 'base1';
	const gymLeaderMetadata = await getGymLeaderMetadata();
	let availableSets = keys(gymLeaderMetadata) || ['base1', 'base2'];
	if (includes(availableSets, cardSet)) {
		cleanCardSet = cardSet;
	}
	return json([
		await generatePack(cleanCardSet),
		await generatePack(cleanCardSet),
		await generatePack(cleanCardSet)
	]);
}
