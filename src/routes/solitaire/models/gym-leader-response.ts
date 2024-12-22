import type { PokemonTCG } from "pokemon-tcg-sdk-typescript";
import type { Type } from "pokemon-tcg-sdk-typescript/dist/enums/type";
import type { SolitaireCard } from "./solitaire-card";
import type { Adventure } from "./adventure";

/** API response from /leaders to give all game data for the set */
export interface GymLeaderResponse {
    firstLeader: {
        name: string;
        imageUrl: string;
        party: PokemonTCG.Card[];
    },
    secondLeader: {
        name: string;
        imageUrl: string;
        party: PokemonTCG.Card[];
    },
    thirdLeader: {
        name: string;
        imageUrl: string;
        party: PokemonTCG.Card[];
    },
    adventures: Adventure[],
}