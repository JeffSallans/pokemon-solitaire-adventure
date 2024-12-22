import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { writable, get, type Writable } from 'svelte/store';
import type { Adventure } from './models/adventure';
import type { GymLeader } from './models/gym-leader';
import * as _ from "lodash";
import type { SolitaireCard } from './models/solitaire-card';
import { SolitaireBattle } from './solitaire-battle';

import type { BattleCard } from './models/battle-card';
import type { GymLeaderResponse } from './models/gym-leader-response';


/** Manages the game state of the pokemon solitaire game */
export class SolitaireGame {

	battle = new SolitaireBattle();

	allAdventures: Adventure[];
	allGymLeaders: GymLeader[];
	packs: PokemonTCG.Card[][];
	
	defeatedGymLeaders: number;
	
	playableAdventures: Writable<Adventure[]> = writable([]);
	currentGymLeader: Writable<GymLeader | null> = writable(null);
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

	/** Card the user picked up to move */
	focusCard: Writable<SolitaireCard | null> = writable(null);
	/** Card the user wants to see in more detail */
	inspectCard: Writable<SolitaireCard | null> = writable(null);

	stackRefs = {};
	adventureRefs = {};

	// ----------------------
	// --- Helper -----------
	// ----------------------

	convertToSolitaireCard(card: PokemonTCG.Card): SolitaireCard {
		return {
			id: _.uniqueId('card'),
			isNewToCollection: true,
			attack: (_.max(
				_.map(card.attacks, (a) => Number.parseInt(a.damage) || 0)
			) || 0) / 10,
			maxHealth: Number.parseInt(card.hp || '100') / 10,
			weakness: _.get(card.weaknesses, '[0].type', undefined),
			type: _.get(card.types, '[0]', PokemonTCG.Type.Colorless),
			cardDef: card
		};
	}

	// ----------------------
	// --- Events -----------
	// ----------------------

	/**
	 * Set card as "Dragging" and "Focus"
	 */
	onCardClick(card: SolitaireCard, currentStack: number) {
		return () => {
			console.log('onClick');
			if (this.playableBench.indexOf(card) == -1) return;

			// Remove active card if another one was active
			if (get(this.focusCard) != null || this.draggingCard != null || this.draggingCardLastStackIndex != null) {
				// Remove focus and drag state
				this.focusCard.set(null);
				this.draggingCard = null;
				this.draggingCardLastStackIndex = null;
			}

			this.draggingCard = card;
			this.draggingCardLastStackIndex = currentStack;

			this.focusCard.set(card);
			// @ts-ignore
			globalThis.focusCard = card;

			this.inspectCard.set(null);
			// @ts-ignore
			globalThis.inspectCard = null;
		};
	}

	/** When a user clicks on a card to view it's details */
	onInspectClick(card: SolitaireCard) {
		console.log('onInspectClick');

		if (get(this.focusCard) == null) {
			this.inspectCard.set(card);
			// @ts-ignore
			globalThis.inspectCard = card;
		}
	}

	/** User selects stack to put the focused card on */
	onStackClick(stackIndex: number) {
		return (e: Event) => {
			console.log('onClickStack');

			// Check if dragging
			if (this.draggingCardLastStackIndex == null || this.draggingCard == null || this.draggingCard.cardDef == null) return;

			// If a new stack move card to new stack
			if (stackIndex != this.draggingCardLastStackIndex) {
				e.preventDefault();
				if (this.draggingCard == null) return;

				this.movePoke(this.draggingCard, stackIndex);
			}
			// If original stack cancel the card dragging
			else {
				// Do nothing
			}

			// Remove focus and drag state
			this.focusCard.set(null);
			// @ts-ignore
			globalThis.focusCard = null;

			this.draggingCard = null;
			this.draggingCardLastStackIndex = null;
		}
	}

	/** Trading a card in for moves */
	onAdventureClick(adventure: Adventure) {
		return (e: Event) => {
			console.log('onClickAdventure');

			// Check if dragging
			if (this.draggingCard == null || this.draggingCard.cardDef == null) return;
			// Check eligibility
			if (this.draggingCard.cardDef.supertype != "Trainer" && this.draggingCard.cardDef.types != null &&
				adventure.conditionEnergy.indexOf(this.draggingCard.cardDef.types[0]) == -1) return;

			// Complete the adventure
			this.completeAdventureWithPoke(this.draggingCard, adventure);

			// Remove focus and drag state
			this.focusCard.set(null);
			// @ts-ignore
			globalThis.focusCard = null;

			this.draggingCard = null;
			this.draggingCardLastStackIndex = null;
		}
	}

	/**
	 * Returns true if the given adventure is eligible
	 * @param adventure the adventure to check
	 * @returns boolean if adventure is eligible
	 */
	isAdventureEligible(adventure: Adventure): boolean {
		// Check if dragging
		if (this.draggingCard == null || this.draggingCard.cardDef == null) return false;

		// Check eligibility
		const eligible = this.draggingCard.cardDef.supertype == "Trainer" || this.draggingCard.cardDef.types == null ||
						adventure.conditionEnergy.indexOf(this.draggingCard.cardDef.types[0]) != -1;
		return eligible;
	}

	/** Trigger an auto battle */
	async onStartGymBattle() {
		this.startBattle();
	}

	// ----------------------
	// --- Actions ----------
	// ----------------------

	/**
	 * Moves the card from it's current stack to the given stackIndex
	 * @modifies this.moves, this.stacks
	 * @param card 
	 * @param stackIndex 
	 */
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

	/** Returns true if the cursor is in the HTML container location */
	isCursorTouching(cursorX: number, cursorY: number, dragContainer: HTMLBaseElement): boolean {
		if (dragContainer == null) return false;
		
		//Very simple detection here
    	if (0 > cursorX - dragContainer.offsetLeft || cursorX - dragContainer.offsetLeft > dragContainer.offsetWidth) 
      		return false;
    	if (0 > cursorY - dragContainer.offsetTop || cursorY - dragContainer.offsetTop > dragContainer.offsetHeight) 
      		return false;
		
		return true;
    }

	/** 
	 * Return the number of the stack you are hovering over
	 * or null if you are not hovering over any stack
	 */
	getHoverOverAdventure(cursorX: number, cursorY: number): Adventure | null {
		const selectedAdventureId = _.find(_.toPairs(this.adventureRefs), a => this.isCursorTouching(cursorX, cursorY, a[1])) || [];
		const selectedAdventure = _.find(this.allAdventures, a => a.id == selectedAdventureId[0]) || null;
		return selectedAdventure;
	}

	/** 
	 * Return the number of the stack you are hovering over
	 * or null if you are not hovering over any stack
	 */
	getHoverOverStack(cursorX: number, cursorY: number): number | null {
		const selectedStack = _.find(_.toPairs(this.stackRefs), s => this.isCursorTouching(cursorX, cursorY, s[1])) || null;
		if (selectedStack == null) return null;
		return Number(selectedStack[0]);
	}

	/** Run an auto battler on the current gym leader and playable bench */
	async startBattle() {
		// Check cost
		if (get(this.moves) == 0) return;

		// Update moves
		this.moves.update((n) => n - 1);

		// Setup gym leader
		const opponentParty: SolitaireCard[] = get(this.currentGymLeader)?.party || [];

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
					(s[i + minIndex] as SolitaireCard[]).push(
						this.convertToSolitaireCard(card)
					);
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

	/**
	 * Triggers the start of the game 
	 * @param packs 
	 * @param mistyParty 
	 * @param surgeParty 
	 * @param blaineParty 
	 */
	setupGame(packs: PokemonTCG.Card[][], leaders: GymLeaderResponse) {
		console.log('Setting up game');

		this.allAdventures = leaders.adventures;

		this.allGymLeaders = [
			{ name: leaders.firstLeader.name, imageUrl: leaders.firstLeader.imageUrl, tier: 1, party: _.map(leaders.firstLeader.party, c => this.convertToSolitaireCard(c)) },
			{ name: leaders.secondLeader.name, imageUrl: leaders.secondLeader.imageUrl, tier: 1, party: _.map(leaders.secondLeader.party, c => this.convertToSolitaireCard(c)) },
			{ name: leaders.thirdLeader.name, imageUrl: leaders.thirdLeader.imageUrl, tier: 1, party: _.map(leaders.thirdLeader.party, c => this.convertToSolitaireCard(c)) },
		];

		this.allAdventures = _.shuffle(this.allAdventures);

		this.defeatedGymLeaders = 0;
		this.moves.set(5);

		this.currentGymLeader.set(this.allGymLeaders[0]);
		this.playableAdventures.set(_.take(this.allAdventures, 2));

		this.packs = packs;

		// Open first pack
		const shuffledPack = _.shuffle(this.packs[0]);

		const openPack: SolitaireCard[] = [];
		for (const card of shuffledPack) {
			openPack.push(this.convertToSolitaireCard(card))
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