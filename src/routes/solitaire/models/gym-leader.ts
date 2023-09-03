import type { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import type { Type } from "pokemon-tcg-sdk-typescript/dist/enums/type";

/** Used to describe the gym leader to defeat */
export interface GymLeader {
    name: string;
    imageUrl: string;
    tier: number;
    party: PokemonTCG.Card[];
}