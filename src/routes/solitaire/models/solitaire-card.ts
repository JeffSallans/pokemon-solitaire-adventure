import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';

/** Tracks additional card data used for solitaire */
export interface SolitaireCard {
    id: string;
    health: number;
    isAsleep: boolean;
    isConfused: boolean;
    isParalyzed: boolean;
    isBurned: boolean;
    isPoisoned: boolean;

    cardDef: PokemonTCG.Card;
}