import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { json } from '@sveltejs/kit';
import { generatePack } from '../solitaire/solitaire-pack';


/**
 * Generates a 11 card pokemon card pack for the given set name
 * @assuems the environment variable POKEMONTCG_API_KEY is set
 * @param setName The ID of the set to use, example base1
 * @returns 
 */
export async function GET() {
	return json([
		await generatePack('base1'),
		await generatePack('base1'),
		await generatePack('base1')
	]);
}
