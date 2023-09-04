import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

/** Tracks additional card data used for solitaire */
export interface SolitaireCard {
    id: string;
    isNewToCollection: boolean;

    cardDef: PokemonTCG.Card;
}