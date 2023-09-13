import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { writable, get, type Writable } from 'svelte/store';
import type { Adventure } from './models/adventure';
import type { GymLeader } from './models/gym-leader';
import * as _ from "lodash";
import type { SolitaireCard } from './models/solitaire-card';
import { SolitaireBattle } from './solitaire-battle';

import fightingImage from '$lib/images/energies/30px-Fighting-attack.png';
import fireImage from '$lib/images/energies/30px-Fire-attack.png';
import grassImage from '$lib/images/energies/30px-Grass-attack.png';
import waterImage from '$lib/images/energies/30px-Water-attack.png';

import mistyImage from '$lib/images/trainers/misty.png';
import surgeImage from '$lib/images/trainers/surge.png';
import blaineImage from '$lib/images/trainers/blaine.png';

import doughnutImage from '$lib/images/adventures/doughnuts.jpeg';
import digletDigImage from '$lib/images/adventures/diglet-dig.png';
import forestRescueImage from '$lib/images/adventures/forest-rescue.jpg';
import sinkingShipImage from '$lib/images/adventures/sinking-ship.jpg';
import type { BattleCard } from './models/battle-card';
import { TCGPlayer } from 'pokemon-tcg-sdk-typescript/dist/sdk';


/** Manages the game state of the pokemon solitaire game */
export class SolitaireGame {

	battle = new SolitaireBattle();

	allAdventures: Adventure[];
	allGymLeaders: GymLeader[];
	packs: PokemonTCG.Card[][];
	
	defeatedGymLeaders: number;
	
	playableAdventures: Writable<Adventure[]> = writable([]);
	currentGymLeader: Writeable<GymLeader> = writable(null);
	stacks: Writable<SolitaireCard[][]> = writable([]);
	
	public get playableBench(): SolitaireCard[] {

		const result: SolitaireCard[] = [];

		let stackSize = get(this.stacks)[0].length;
		if (stackSize > 0) result.push(get(this.stacks)[0][stackSize - 1])

		stackSize = get(this.stacks)[1].length;
		if (stackSize > 0) result.push(get(this.stacks)[1][stackSize - 1])

		stackSize = get(this.stacks)[2].length;
		if (stackSize > 0) result.push(get(this.stacks)[2][stackSize - 1])

		stackSize = get(this.stacks)[3].length;
		if (stackSize > 0) result.push(get(this.stacks)[3][stackSize - 1])

		return result;
	}

	draggingCardLastStackIndex: number | null;
	draggingCard: SolitaireCard | null;
	targetStackIndex: number | null;
	targetAdventure: Adventure | null;

	moves = writable(0);

	focusCard: Writable<PokemonTCG.Card | null> = writable(null);

	// ----------------------
	// --- Events -----------
	// ----------------------

	onHover(card: PokemonTCG.Card) {
		return () => {
			console.log('onHover');
			this.focusCard.set(card);
		};
	}

	onExit(card: PokemonTCG.Card) {
		return () => {
			console.log('onHoverExit');
			this.focusCard.set(null);
		};
	}

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
		return (e: Event) => {
			// Check eligibility
			if (this.draggingCard.cardDef.supertype != "Trainer" &&
				adventure.conditionEnergy.indexOf(this.draggingCard.cardDef.types[0]) == -1) return;
			
			console.log('onAdventureHoverEnter');
			
			e.target.setAttribute('data-drag-consider', 'true');

			// If eligible remove greyscale and set value
			this.targetAdventure = adventure;
		};
	}

	onAdventureHoverExit(adventure: Adventure) {
		return (e: Event) => {
			console.log('onAdventureHoverExit');

			e.target.setAttribute('data-drag-consider', 'false');

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

	/** Trigger an auto battle */
	async onStartGymBattle() {
		this.startBattle();
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


		// Check if player lost
		if (get(this.moves) == 0) {
			document.write('YOU LOSE, you ran out of moves. Refresh to play again');
		}
	}

	completeAdventureWithPoke(card: SolitaireCard, adventure: Adventure) {
		// Check elibility
		if (card.cardDef.supertype != "Trainer" &&
			adventure.conditionEnergy.indexOf(card.cardDef.types[0]) == -1) return;

		// Claim reward
		this.moves.update((n) => n + adventure.reward);
		
		// Animate card exit
		this.stacks.update((v) => {
			v[this.draggingCardLastStackIndex].pop();
			return v;
		});

		// Generate new adventure
		this.playableAdventures.update((a) => {
			const replaceIndex = a.indexOf(adventure);
			const nextAdventure = (this.allAdventures.pop() as Adventure);
			this.allAdventures.unshift(nextAdventure);
			a[replaceIndex] = nextAdventure;
			return a;
		});
	}

	/** Run an auto battler on the current gym leader and playable bench */
	async startBattle() {
		// Check cost
		if (get(this.moves) == 0) return;

		// Update moves
		this.moves.update((n) => n - 1);

		// Setup gym leader
		const opponentParty: SolitaireCard[] = _.map(get(this.currentGymLeader).party, (c) => {
			return {
				id: _.uniqueId('card'),
				isNewToCollection: false,
				cardDef: c
			};
		})

		// Trigger auto battler
		const playablePokemon = _.filter(this.playableBench, card => card.cardDef.supertype == 'Pokémon');
		const playerWon = await this.battle.start(opponentParty, playablePokemon);

		// Check if player lost
		if (!playerWon && get(this.moves) == 0) {
			document.write('YOU LOSE, you ran out of moves. Refresh to play again');
		}

		// If the player won add more cards
		if (playerWon && this.defeatedGymLeaders == 2) {
			document.write('YOU WIN, Refresh to play again');
		}
		else if (playerWon) {
			// Update defeated indicator
			this.defeatedGymLeaders++;

			// Remove playable bench used
			this.stacks.update(s => {
				for (const stack of s) {
					(stack as SolitaireCard[]).pop();
				}
				return s;
			});

			// Open first pack
			const shuffledPack = _.shuffle(this.packs[this.defeatedGymLeaders]);

			// Deal new pack
			const maxIndex = get(this.stacks).length;
			const minIndex = 0;
			const indexRange = maxIndex - minIndex;

			let i = 0;
			for (const card of shuffledPack) {
				this.stacks.update(s => {
					(s[i + minIndex] as SolitaireCard[]).push({
						id: _.uniqueId('card'),
						isNewToCollection: true,
						cardDef: card
					});
					return s;
				});
				i = (i + 1) % indexRange;
			}

			// Determine new gym leader
			this.currentGymLeader.set(this.allGymLeaders[this.defeatedGymLeaders]);
		}
	}
	
	/**
	 * Create a game object from the player's cookie, or initialise a new game
	 */
	constructor(serialized: string | undefined = undefined) {
		console.log('Constructor');


		this.allAdventures = [];
		this.allGymLeaders = [];

		this.defeatedGymLeaders = 0;
		this.moves.set(0);

		this.currentGymLeader.set(this.allGymLeaders[0]);
		this.playableAdventures.set([]);

		this.packs = [];
		this.stacks.set([]);

		this.draggingCardLastStackIndex = 0;
		this.draggingCard = null;
		this.targetStackIndex = null
		this.targetAdventure = null;
	}

	setupGame(packs: PokemonTCG.Card[][], mistyParty: PokemonTCG.Card[], surgeParty: PokemonTCG.Card[], blaineParty: PokemonTCG.Card[]) {
		console.log('Setting up game');

		this.allAdventures = [
			{ id: _.uniqueId('adv'), name: 'Help a chief', imageUrl: doughnutImage, energyUrl: fireImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire], consider: false},
			{ id: _.uniqueId('adv'), name: 'Forest Rescue', imageUrl: forestRescueImage, energyUrl: grassImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Fairy], consider: false},
			{ id: _.uniqueId('adv'), name: 'Escape a sinking ship', imageUrl: sinkingShipImage, energyUrl: waterImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon], consider: false},
			{ id: _.uniqueId('adv'), name: 'Fix a broken road', imageUrl: digletDigImage, energyUrl: fightingImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal], consider: false},
			{ id: _.uniqueId('adv'), name: 'Help a chief', imageUrl: doughnutImage, energyUrl: fireImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire, PokemonTCG.Type.Lightening], consider: false},
			{ id: _.uniqueId('adv'), name: 'Forest Rescue', imageUrl: forestRescueImage, energyUrl: grassImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Fairy], consider: false},
			{ id: _.uniqueId('adv'), name: 'Escape a sinking ship', imageUrl: sinkingShipImage, energyUrl: waterImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon], consider: false},
			{ id: _.uniqueId('adv'), name: 'Fix a broken road', imageUrl: digletDigImage, energyUrl: fightingImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal], consider: false},
			{ id: _.uniqueId('adv'), name: 'Help a chief', imageUrl: doughnutImage, energyUrl: fireImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire, PokemonTCG.Type.Lightening], consider: false},
			{ id: _.uniqueId('adv'), name: 'Forest Rescue', imageUrl: forestRescueImage, energyUrl: grassImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass, PokemonTCG.Type.Fairy], consider: false},
			{ id: _.uniqueId('adv'), name: 'Escape a sinking ship', imageUrl: sinkingShipImage, energyUrl: waterImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water, PokemonTCG.Type.Dragon], consider: false},
			{ id: _.uniqueId('adv'), name: 'Fix a broken road', imageUrl: digletDigImage, energyUrl: fightingImage, reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting, PokemonTCG.Type.Metal], consider: false},
		];

		this.allGymLeaders = [
			{ name: 'Misty', imageUrl: mistyImage, tier: 1, party: mistyParty},
			{ name: 'Surge', imageUrl: surgeImage, tier: 1, party: surgeParty},
			{ name: 'Blaine', imageUrl: blaineImage, tier: 1, party: blaineParty}
		];

		this.allAdventures = _.shuffle(this.allAdventures);
		//this.allGymLeaders = _.shuffle(this.allGymLeaders);

		this.defeatedGymLeaders = 0;
		this.moves.set(5);

		this.currentGymLeader.set(this.allGymLeaders[0]);
		this.playableAdventures.set(_.take(this.allAdventures, 2));

		this.packs = packs;

		// Open first pack
		const shuffledPack = _.shuffle(this.packs[0]);

		const openPack: SolitaireCard[] = [];
		for (const card of shuffledPack) {
			openPack.push({
				id: _.uniqueId('card'),
				isNewToCollection: true,
				cardDef: card
			})
		}

		this.stacks.set([
			_.slice(openPack, 0, 2),
			_.slice(openPack, 2, 5),
			_.slice(openPack, 5, 8),
			_.slice(openPack, 8, 11)
		]);

		this.draggingCardLastStackIndex = 0;
		this.draggingCard = null;
		this.targetStackIndex = null
		this.targetAdventure = null;
	}

	/**
	 * Serialize game state so it can be set as a cookie
	 */
	toString() {
		return '';
	}
}