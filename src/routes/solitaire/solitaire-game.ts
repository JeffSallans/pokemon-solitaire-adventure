import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { writable, get } from 'svelte/store';
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
	stacks = writable([]);
	
	public get playableBench(): SolitaireCard[] {

		const result = [];

		let stackSize = get(this.stacks)[0].length;
		if (stackSize > 0) result.push(get(this.stacks)[0][stackSize - 1])

		stackSize = get(this.stacks)[1].length;
		if (stackSize > 0) result.push(get(this.stacks)[1][stackSize - 1])

		stackSize = get(this.stacks)[2].length;
		if (stackSize > 0) result.push(get(this.stacks)[2][stackSize - 1])

		stackSize = get(this.stacks)[3].length;
		if (stackSize > 0) result.push(get(this.stacks)[3][stackSize - 1])

		stackSize = get(this.stacks)[4].length;
		if (stackSize > 0) result.push(get(this.stacks)[4][stackSize - 1])

		return result;
	}

	draggingCardLastStackIndex: number | null;
	draggingCard: SolitaireCard | null;
	targetStackIndex: number | null;
	targetAdventure: Adventure | null;

	moves = writable(0);
	
	// ----------------------
	// --- Events -----------
	// ----------------------

	/** Sets the drag for the card */
	dragCard(card: SolitaireCard, currentStack: number) {
		return () => {
			console.log('dragCard');
			this.draggingCard = card;
			this.draggingCardLastStackIndex = currentStack;
		};
	}

	dropCard() {
		return () => {
			console.log('dropCard');

			if (this.targetStackIndex != null) this.onStackDrop(this.targetStackIndex);
			else if (this.targetAdventure != null) this.onAdventureDrop(this.targetAdventure);

			this.draggingCard = null;
			this.draggingCardLastStackIndex = null;
		};
	}

	onStackHoverEnter(stackIndex: number) {
		return () => {
			// Check eligibility
			if (get(this.moves) == 0 || stackIndex == this.draggingCardLastStackIndex) return;
			
			console.log('onStackHoverEnter');
			
			// Show consideration and disable draggedCard
			this.targetStackIndex = stackIndex;
		};
	}

	onStackHoverExit(stackIndex: number) {
		return () => {
			// Check eligibility
			if (get(this.moves) == 0 || stackIndex == this.draggingCardLastStackIndex) return;
			
			console.log('onStackHoverExit');
	
			// Remove consideration and enable draggedCard
			this.targetStackIndex = null;
		};
	}

	onStackDrop(stackIndex: number) {
		return (e) => {
			e.preventDefault();
			console.log('onStackDrop');

			this.movePoke(this.draggingCard, stackIndex);
		};
	}

	onAdventureHoverEnter(adventure: Adventure) {
		return () => {
			// Check eligibility
			if (this.draggingCard.cardDef.supertype != "Trainer" &&
				adventure.conditionEnergy.indexOf(this.draggingCard.cardDef.types[0]) == -1) return;
			console.log('onAdventureHoverEnter');

			// If eligible remove greyscale and set value
			this.targetAdventure = adventure;
		};
	}

	onAdventureHoverExit(adventure: Adventure) {
		return () => {
			console.log('onAdventureHoverExit');

			// Add back greyscale and remove value
			this.targetAdventure = null;
		};
	}

	onAdventureDrop(adventure: Adventure) {
		return () => {
			console.log('onAdventureDrop');

			this.completeAdventureWithPoke(this.draggingCard, adventure);
		};
	}

	onStartGymBattle() {
		// Trigger auto battler
	}

	// ----------------------
	// --- Actions ----------
	// ----------------------

	movePoke(card: SolitaireCard, stackIndex: number) {
		// Check cost
		if (get(this.moves) == 0 || stackIndex == this.draggingCardLastStackIndex) return;

		// Update moves
		this.moves.update((n) => n - 1);

		// Clear currentCard
		this.stacks.update((v) => {
			v[stackIndex].push(this.draggingCard);
			v[this.draggingCardLastStackIndex].pop();
			return v;
		});
		// Animate enter

	}

	completeAdventureWithPoke(card: SolitaireCard, adventure: Adventure) {
		// Check elibility
		if (card.cardDef.supertype != "Trainer" &&
			adventure.conditionEnergy.indexOf(card.cardDef.types[0]) == -1) return;

		// Claim reward
		this.moves.update((n) => n + adventure.reward);
		
		// Animate exit
		this.stacks.update((v) => {
			v[this.draggingCardLastStackIndex].pop();
			return v;
		});

		// Generate new adventure

		// Animate enter
	}
	
	/**
	 * Create a game object from the player's cookie, or initialise a new game
	 */
	constructor(serialized: string | undefined = undefined) {
		console.log('Constructor');

		this.allAdventures = [
			{ id: _.uniqueId('adv'), name: 'Help a chief', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire, PokemonTCG.Type.Lightening] },
			{ id: _.uniqueId('adv'), name: 'Lost in the woods', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Psychic, PokemonTCG.Type.Darkness] },
			{ id: _.uniqueId('adv'), name: 'Escape a sinking ship', imageUrl: '', reward: 3, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon] },
			{ id: _.uniqueId('adv'), name: 'Fix a broken bridge', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal] },
			{ id: _.uniqueId('adv'), name: 'Help a chief', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire, PokemonTCG.Type.Lightening] },
			{ id: _.uniqueId('adv'), name: 'Lost in the woods', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Psychic, PokemonTCG.Type.Darkness] },
			{ id: _.uniqueId('adv'), name: 'Escape a sinking ship', imageUrl: '', reward: 3, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon] },
			{ id: _.uniqueId('adv'), name: 'Fix a broken bridge', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal] },
			{ id: _.uniqueId('adv'), name: 'Help a chief', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire, PokemonTCG.Type.Lightening] },
			{ id: _.uniqueId('adv'), name: 'Lost in the woods', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Psychic, PokemonTCG.Type.Darkness] },
			{ id: _.uniqueId('adv'), name: 'Escape a sinking ship', imageUrl: '', reward: 3, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon] },
			{ id: _.uniqueId('adv'), name: 'Fix a broken bridge', imageUrl: '', reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal] },
		];
		this.allAdventures = _.shuffle(this.allAdventures);

		this.allGymLeaders = [
			{ name: 'Misty', imageUrl: '', tier: 1, party: [

			]}
		];
		this.allGymLeaders = _.shuffle(this.allGymLeaders);

		this.defeatedGymLeaders = 0;
		this.focus = '';
		this.moves.set(0);

		this.currentGymLeader = this.allGymLeaders[0];
		this.playableAdventures = _.take(this.allAdventures, 4);

		this.packs = [];
		this.stacks.set([]);
		this.focusedPoke = null;
	}

	setupGame(packs: PokemonTCG.Card[][]) {
		console.log('Setting up game');

		this.allAdventures = _.shuffle(this.allAdventures);
		this.allGymLeaders = _.shuffle(this.allGymLeaders);

		this.defeatedGymLeaders = 0;
		this.focus = '';
		this.moves.set(2);

		this.currentGymLeader = this.allGymLeaders[0];
		this.playableAdventures = _.take(this.allAdventures, 4);

		this.packs = packs;

		// Open first pack
		const shuffledPack = _.shuffle(this.packs[0]);

		const openPack: SolitaireCard[] = [];
		for (const card of shuffledPack) {
			openPack.push({
				id: _.uniqueId('card'),
				health: card.health,
				isAsleep: false,
				isConfused: false,
				isParalyzed: false,
				isBurned: false,
				isPoisoned: false,
			
				cardDef: card
			})
		}

		this.stacks.set([
			[],
			[],
			_.slice(openPack, 0, 3),
			_.slice(openPack, 3, 7),
			_.slice(openPack, 7, 11)
		]);
		this.focusedPoke = null;
	}

	/**
	 * Serialize game state so it can be set as a cookie
	 */
	toString() {
		return '';
	}
}
