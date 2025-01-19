import * as _ from "lodash";
import type { SolitaireCard } from './models/solitaire-card';
import type { BattleCard } from './models/battle-card';
import type { BattleMove } from './models/battle-move';
import { Type, type Attack } from 'pokemon-tcg-sdk-typescript/dist/sdk';
import { get, writable, type Writable } from "svelte/store";

/** Manages the battle state of a single battle */
export class SolitaireBattle {
	playerParty: BattleCard[];
	opponentParty: BattleCard[];
	activePlayer: Writable<BattleCard | null> = writable(null);
	activeOpponent: Writable<BattleCard | null> = writable(null);

	playerHealth: Writable<boolean[]> = writable([]);
	opponentHealth: Writable<boolean[]> = writable([]);

	state = writable('');

	constructor() {
		this.opponentParty = [];
		this.playerParty = [];
		this.state.set('Waiting');
	}

	/** Starts the battles, returns true if the player won */
	async start(_opponentParty: SolitaireCard[], _playerParty: SolitaireCard[]): Promise<boolean> {
		this.opponentParty = _.map(_opponentParty, (c) => this.createCard(c));
		this.playerParty = _.map(_playerParty, (c) => this.createCard(c));
		this.activeOpponent.set(this.opponentParty[0]);
		this.activePlayer.set(this.playerParty[0]);
		this.state.set('Battling');
		await new Promise(resolve => setTimeout(resolve, 500));

		while (get(this.state) == 'Battling') {
			this.opponentTurn();
			await new Promise(resolve => setTimeout(resolve, 500));
			
			this.state.set(this.checkEndCondition());
			await new Promise(resolve => setTimeout(resolve, 500));
			if (get(this.state) != 'Battling') break;

			this.playerTurn();
			await new Promise(resolve => setTimeout(resolve, 500));

			this.state.set(this.checkEndCondition());
			await new Promise(resolve => setTimeout(resolve, 500));
			if (get(this.state) != 'Battling') break;
		}

		await new Promise(resolve => setTimeout(resolve, 1000));

		return get(this.state) == 'Win';
	}

	/** Used to create the battle card data model */
	private createCard(card: SolitaireCard): BattleCard  {
		return {
			id: _.uniqueId('battlecard'),
			health: card.maxHealth * 10,
			maxHealth: card.maxHealth * 10,
			isKnockedOut: false,
			isAsleep: false,
			isBurned: false,
			isConfused: false,
			isParalyzed: false,
			isPoisoned: false,
			cardInfo: card
		}
	}

	/** Perform the opponents turn */
	opponentTurn() {
		const move = this.pickMove(get(this.activeOpponent), get(this.activePlayer));
		this.dealDamage(get(this.activeOpponent), this.activePlayer, move);
	}

	/** Performs the users turn */
	playerTurn() {
		const move = this.pickMove(get(this.activePlayer), get(this.activeOpponent));
		this.dealDamage(get(this.activePlayer), this.activeOpponent, move);
	}

	/** Returns the status condition */
	checkEndCondition(): string {
		// Update knockout
		this.playerParty.forEach(c => {
			c.isKnockedOut = this.isKnockedOut(c);
		});
		this.opponentParty.forEach(c => {
			c.isKnockedOut = this.isKnockedOut(c);
		});

		// Determine next active
		if (get(this.activePlayer) == null || get(this.activePlayer)?.health == 0) {
			this.activePlayer.set(_.find(this.playerParty, (c) => !c.isKnockedOut) || null);
		}
		if (get(this.activeOpponent) == null || get(this.activeOpponent)?.health == 0) {
			this.activeOpponent.set(_.find(this.opponentParty, (c) => !c.isKnockedOut) || null);
		}

		// Determine
		if (get(this.activePlayer) == null) {
			console.debug('Opponent Won');
			return 'Loss';
		}
		if (get(this.activeOpponent) == null) {
			console.debug('Player Won');
			return 'Win';
		}

		return 'Battling';
	}

	/** Returns the details of the users move */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	pickMove(user: BattleCard | null, target: BattleCard | null): BattleMove {
		if (user == null) {
			return {
				id: _.uniqueId('battlemove'),
				name: 'splash',
				damage: 0,
				type: Type.Colorless,
				damageCalculation: 'standard',
				maxDamage: 100,
				setAsleep: false,
				setBurned: false,
				setConfused: false,
				setParalyzed: false,
				setPoisoned: false,
			}
		}

		return {
			id: _.uniqueId('battlemove'),
			name: 'splash',
			damage: user.cardInfo.attack * 10,
			type: user.cardInfo.type,
			damageCalculation: 'standard',
			maxDamage: user.cardInfo.attack * 10,
			setAsleep: false,
			setBurned: false,
			setConfused: false,
			setParalyzed: false,
			setPoisoned: false,
		};
	}

	/** Updates the models and UI with the damage result */
	dealDamage(user: BattleCard | null, target: Writable<BattleCard | null> | null, move: BattleMove) {
		if (user == null || target == null) return;
		let weaknessMultiplier = 1;
		if (_.get(get(target), 'cardInfo.cardDef.weaknesses[0].type', null) == move.type) weaknessMultiplier = 2;
		let resistanceValue = 0;
		if (_.get(get(target), 'cardInfo.cardDef.resistances[0].type', null) == move.type) resistanceValue = 3;

		if (move.damageCalculation == 'standard') {
			const damage = Math.max((move.damage * weaknessMultiplier) - resistanceValue, 0);
			target.update(t => {
				if (t == null) return t;
				t.health = Math.max(t.health - damage, 0);
				return t;
			});
			console.debug(`${user.cardInfo.cardDef.name} dealt ${damage} damage. (${get(target)?.health} left)`);
		}
	}

	/** Returns true if the card is unable to keep playing */
	isKnockedOut(card: BattleCard): boolean {
		return card.health == 0;
	}
}
