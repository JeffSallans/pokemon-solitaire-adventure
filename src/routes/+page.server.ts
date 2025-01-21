import { getGymLeaderMetadata } from './api/gym-leader-metadata';
import type { PageServerLoad } from './$types';
import pkg from 'lodash';
const { keys, map } = pkg;

export const load: PageServerLoad = async ({ params }) => {

    const gymLeaderMetadata = await getGymLeaderMetadata();
	const cardSets = keys(gymLeaderMetadata);
	const cardSetMetadata = map(cardSets, s => {
		return {
			id: s,
			url: gymLeaderMetadata[s].packUrl,
		}
	});
	return {
		cardSetMetadata,
	};
};