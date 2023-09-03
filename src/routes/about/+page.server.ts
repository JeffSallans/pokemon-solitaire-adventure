import { error } from '@sveltejs/kit';

import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'
import type { PageServerLoad } from './$types';

export async function load(): Promise<PageServerLoad> {
  
    const charazardImage = (await PokemonTCG.findCardByID('base1-4')).images.large;
    
    return {
        post: {
            charazardImage,
        }
    };
}