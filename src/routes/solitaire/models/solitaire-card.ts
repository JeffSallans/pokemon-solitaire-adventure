import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import type { Type } from 'pokemon-tcg-sdk-typescript/dist/sdk';

/** Tracks additional card data used for solitaire */
export interface SolitaireCard {
    id: string;
    isNewToCollection: boolean;
    /** Damage each turn */
    attack: number;
    /** Health to start the battle with */
    maxHealth: number;
    /** The attacking type */
    type: PokemonTCG.Type;
    /** The type weakness */
    weakness: PokemonTCG.Type | undefined;
    /** The PokemonTCG API details */
    cardDef: PokemonTCG.Card;
    /** True if the card has been upgraded and the upgradeAttack 
     * and upgradeHealth have been added to attack and maxHealth */
    isUpgraded: boolean;
    /** How many moves it costs to upgrade */
    upgradeCost: number;
    /** Value to add to attack for the upgrade */
    upgradeAttack: number;
    /** Value to add to maxHealth for the upgrade */
    upgradeHealth: number;
}