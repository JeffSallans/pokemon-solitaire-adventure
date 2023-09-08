import type { Type } from "pokemon-tcg-sdk-typescript/dist/enums/type";

/** Used to describe the conditions to move cards off the stack */
export interface Adventure {
    id: string;
    name: string;
    imageUrl: string;
    reward: number;
    /** True if the adventure should show as being considered for drop */
    consider: boolean;
    conditionType: string;
    conditionEnergy: Type[];
}