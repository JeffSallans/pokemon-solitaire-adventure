import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { json } from '@sveltejs/kit';
import { map, pick } from 'lodash';

/**
 * Returns all pokemon TCG set data
 * @assuems the environment variable POKEMONTCG_API_KEY is set
 * @returns setName
 */
export async function GET() {
	const allSets = (await PokemonTCG.getAllSets());
	return json(
		map(allSets, (set) => pick(set, ['id', 'name', 'releaseDate']))
	);
}
