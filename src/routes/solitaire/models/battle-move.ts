/** Tracks details of the move used in battle */
export interface BattleMove {
    id: string;
    name: string;
    damageCalculation: string;
    damage: number;
    type: Type;

    setAsleep: boolean;
    setConfused: boolean;
    setParalyzed: boolean;
    setBurned: boolean;
    setPoisoned: boolean;
}