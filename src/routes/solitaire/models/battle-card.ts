/** Tracks additional card data used for battling */
export interface BattleCard {
    id: string;
    health: number;
    isAsleep: boolean;
    isConfused: boolean;
    isParalyzed: boolean;
    isBurned: boolean;
    isPoisoned: boolean;

    cardInfo: SolitaireCard;
}