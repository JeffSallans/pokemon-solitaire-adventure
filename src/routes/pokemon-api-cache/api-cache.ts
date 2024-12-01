import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import * as fs from 'node:fs';
import pkg from 'lodash';

const { has, get } = pkg;

let findCardsByQueriesCache: { [id: string] : PokemonTCG.Card[] } = {};
let findCardByIDCache: { [id: string] : PokemonTCG.Card } = {};

/**
 * Caches the findCardsByQueries function to avoid API load
 * @assuems the environment variable POKEMONTCG_API_KEY is set
 * @param params the value to pass into PokemonTCG.findCardsByQueries
 * @returns 
 */
export async function findCardsByQueries(params: { q: string }): Promise<PokemonTCG.Card[] | undefined> {
	const query: string = params.q;

	if (fs.existsSync('findCardsByQueriesCache.json')) {
		findCardsByQueriesCache = JSON.parse(fs.readFileSync('findCardsByQueriesCache.json').toString());
	}

	// Return cache if available
	if (has(findCardsByQueriesCache, query)) {
		console.log(`cache found for: ${query}`)
		return get(findCardsByQueriesCache, query, undefined)
	}

	const result = (await PokemonTCG.findCardsByQueries(params));
	findCardsByQueriesCache[query] = result;
	try {
		fs.writeFileSync('findCardsByQueriesCache.json', JSON.stringify(findCardsByQueriesCache));
	}
	catch (err) {
		console.log(err);
	}
	return result;
}

/**
 * Caches the findCardsByQueries function to avoid API load
 * @assuems the environment variable POKEMONTCG_API_KEY is set
 * @param params the value to pass into PokemonTCG.findCardsByQueries
 * @returns 
 */
export async function findCardByID(cardId: string): Promise<PokemonTCG.Card | undefined> {

	if (fs.existsSync('findCardByIDCache.json')) {
		findCardByIDCache = JSON.parse(fs.readFileSync('findCardByIDCache.json').toString());
	}

	// Return cache if available
	if (has(findCardByIDCache, cardId)) {
		console.log(`cache found for: ${cardId}`)
		return get(findCardByIDCache, cardId, undefined)
	}

	const result = (await PokemonTCG.findCardByID(cardId));
	findCardByIDCache[cardId] = result;
	try {
		fs.writeFileSync('findCardByIDCache.json', JSON.stringify(findCardByIDCache));
	}
	catch (err) {
		console.log(err);
	}
	return result;
}