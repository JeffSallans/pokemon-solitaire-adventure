import type { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import pkg from 'lodash';
import { findCardsByQueries } from '../pokemon-api-cache/api-cache';
const { take, shuffle } = pkg;

/**
 * Generates a 11 card pokemon card pack for the given set name
 * @assuems the environment variable POKEMONTCG_API_KEY is set
 * @param setName The ID of the set to use, example base1
 * @returns 
 */
export async function generatePack(setName: string): Promise<PokemonTCG.Card[]> {
	const setCommons = (await findCardsByQueries({q: `set.id:${setName} supertype:Pokemon rarity:Common`}));
	const selectedCommons = take(shuffle(setCommons), 6);

	const setUncommons = (await findCardsByQueries({q: `set.id:${setName} supertype:Pokemon rarity:Uncommon`}));
	const selectedUncommons = take(shuffle(setUncommons), 3);

	const setRare = (await findCardsByQueries({q: `set.id:${setName} supertype:Pokemon rarity:Rare*`}));
	const selectedRare = take(shuffle(setRare), 1);

	const setTrainers = (await findCardsByQueries({q: `set.id:${setName} supertype:Trainer`}));
	const selectedTrainer = take(shuffle(setTrainers), 1);
	return [...selectedCommons, ...selectedUncommons, ...selectedTrainer, ...selectedRare];
}
