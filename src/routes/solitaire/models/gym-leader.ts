import type { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import type { Type } from "pokemon-tcg-sdk-typescript/dist/enums/type";
import type { SolitaireCard } from "./solitaire-card";

/** Used to describe the gym leader to defeat */
export interface GymLeader {
    name: string;
    imageUrl: string;
    tier: number;
    party: SolitaireCard[];
}