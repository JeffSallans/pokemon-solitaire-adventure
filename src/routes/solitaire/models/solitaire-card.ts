import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import type { Type } from 'pokemon-tcg-sdk-typescript/dist/sdk';

/** Tracks additional card data used for solitaire */
export interface SolitaireCard {
    id: string;
    isNewToCollection: boolean;
    attack: number;
    maxHealth: number;
    type: PokemonTCG.Type;
    weakness: PokemonTCG.Type | undefined;
    cardDef: PokemonTCG.Card;
}