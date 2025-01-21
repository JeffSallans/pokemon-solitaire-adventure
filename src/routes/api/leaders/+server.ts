import { json } from '@sveltejs/kit';
import pkg from 'lodash';
import { getGymLeaderMetadata } from '../gym-leader-metadata';
const { includes, keys } = pkg;


/**
 * Returns the gym leader details
 */
export async function GET(request: { url: { searchParams: { get: (arg0: string) => string; }; }; }) {
	
	const leaders = await getGymLeaderMetadata()
	
	let cardSet = request.url.searchParams.get('cardSet') || '';
	let cleanCardSet = 'base1';
	let availableSets = keys(leaders) || ['base1', 'base2'];
	if (includes(availableSets, cardSet)) {
		cleanCardSet = cardSet;
	}

	// @ts-ignore
	let leadersForSet = leaders[cleanCardSet];
	
	// Set default if param
	if (leadersForSet == null) {
		leadersForSet = leaders.base1;
	}

	return json(leadersForSet);
}
