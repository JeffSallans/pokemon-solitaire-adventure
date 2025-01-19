import type { SolitaireCard } from "./solitaire-card";

/** Tracks additional card data used for battling */
export interface BattleCard {
    id: string;
    health: number;
    maxHealth: number;

    isKnockedOut: boolean;
    isAsleep: boolean;
    isConfused: boolean;
    isParalyzed: boolean;
    isBurned: boolean;
    isPoisoned: boolean;

    cardInfo: SolitaireCard;
}