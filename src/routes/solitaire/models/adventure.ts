import type { Type } from "pokemon-tcg-sdk-typescript/dist/enums/type";

/** Used to describe the conditions to move cards off the stack */
export interface Adventure {
    name: string;
    imageUrl: string;
    reward: number;
    conditionType: string;
    conditionEnergy: Type[];
}