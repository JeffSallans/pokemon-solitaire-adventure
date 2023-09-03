import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import * as _ from "lodash";

/**
 * Generates a 11 card pokemon card pack for the given set name
 * @assuems the environment variable POKEMONTCG_API_KEY is set
 * @param setName The ID of the set to use, example base1
 * @returns 
 */
export async function generatePack(setName: string): Promise<PokemonTCG.Card[]> {
	const setCommons = (await PokemonTCG.findCardsByQueries({q: `set.id:${setName} rarity:Common`}));
	const selectedCommons = _.take(_.shuffle(setCommons), 7);

	const setUncommons = (await PokemonTCG.findCardsByQueries({q: `set.id:${setName} rarity:Uncommon`}));
	const selectedUncommons = _.take(_.shuffle(setUncommons), 3);

	const setRare = (await PokemonTCG.findCardsByQueries({q: `set.id:${setName} rarity:Rare*`}));
	const selectedRare = _.take(_.shuffle(setRare), 1);
	return [...selectedCommons, ...selectedUncommons, ...selectedRare];
}
