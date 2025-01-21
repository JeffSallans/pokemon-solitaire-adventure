import { getGymLeaderMetadataBySet } from '../api/gym-leader-metadata';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
    const cardSet = url.searchParams.get('cardSet') || 'base1';

    const gymLeaderMetadata = await getGymLeaderMetadataBySet(cardSet);
	return {
		defeatGif: gymLeaderMetadata.defeatGif
	};
};