import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import type { Adventure } from './models/adventure';
import type { GymLeader } from './models/gym-leader';
import * as _ from "lodash";

/** Manages the game state of the pokemon solitaire game */
export class SolitaireGame {
	allAdventures: Adventure[];
	allGymLeaders: GymLeader[];
	packs: PokemonTCG.Card[][];
	
	defeatedGymLeaders: number;
	
	playableAdventures: Adventure[];
	currentGymLeader: GymLeader;
	stacks: PokemonTCG.Card[][];
	playableBench: PokemonTCG.Card[];

	focus: string; //gym or poke
	focusedPoke: PokemonTCG.Card | null;

	moves: number;
	
	selectPoke()
	movePoke()
	completeAdventureWithPoke()
	
	selectGym()
	selectPokeToBattle()

	/**
	 * Create a game object from the player's cookie, or initialise a new game
	 */
	constructor(serialized: string | undefined = undefined) {
		
		this.allAdventures = [
			{ name: 'Help a chief', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire, PokemonTCG.Type.Lightening] },
			{ name: 'Lost in the woods', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Psychic, PokemonTCG.Type.Darkness] },
			{ name: 'Escape a sinking ship', imageUrl: '', reward: 30, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon] },
			{ name: 'Fix a broken bridge', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal] },
			{ name: 'Help a chief', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire, PokemonTCG.Type.Lightening] },
			{ name: 'Lost in the woods', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Psychic, PokemonTCG.Type.Darkness] },
			{ name: 'Escape a sinking ship', imageUrl: '', reward: 30, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon] },
			{ name: 'Fix a broken bridge', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal] },
			{ name: 'Help a chief', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire, PokemonTCG.Type.Lightening] },
			{ name: 'Lost in the woods', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Psychic, PokemonTCG.Type.Darkness] },
			{ name: 'Escape a sinking ship', imageUrl: '', reward: 30, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon] },
			{ name: 'Fix a broken bridge', imageUrl: '', reward: 20, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal] },
		];
		this.allAdventures = _.shuffle(this.allAdventures);

		this.allGymLeaders = [
			{ name: 'Misty', imageUrl: '', tier: 1, party: [

			]}
		];
		this.allGymLeaders = _.shuffle(this.allGymLeaders);

		this.defeatedGymLeaders = 0;
		this.focus = '';
		this.moves = 0;

		this.currentGymLeader = this.allGymLeaders[0];
		this.playableAdventures = _.take(this.allAdventures, 4);
		this.playableBench = [];

		this.packs = [];
		this.stacks = [];
		this.focusedPoke = null;
	}

	setupGame(packs: PokemonTCG.Card[][]) {
		this.allAdventures = _.shuffle(this.allAdventures);
		this.allGymLeaders = _.shuffle(this.allGymLeaders);

		this.defeatedGymLeaders = 0;
		this.focus = '';
		this.moves = 2;

		this.currentGymLeader = _.first(this.allGymLeaders);
		this.playableAdventures = _.take(this.allAdventures, 4);
		this.playableBench = [];

		this.packs = packs;

		// Open first pack
		const openPack = _.shuffle(this.packs.pop());

		this.stacks = [
			[],
			[],
			_.slice(openPack, 0, 3),
			_.slice(openPack, 3, 7),
			_.slice(openPack, 7, 11)
		];
		this.focusedPoke = null;
	}


	

	/**
	 * Serialize game state so it can be set as a cookie
	 */
	toString() {
		return '';
	}
}
