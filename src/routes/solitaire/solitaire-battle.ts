import * as _ from "lodash";
import type { SolitaireCard } from './models/solitaire-card';
import type { BattleCard } from './models/battle-card';
import type { BattleMove } from './models/battle-move';
import { Type, type Attack } from 'pokemon-tcg-sdk-typescript/dist/sdk';

/** Manages the battle state of a single battle */
export class SolitaireBattle {
	playerParty: BattleCard[];
	opponentParty: BattleCard[];
	activePlayer: BattleCard | null;
	activeOpponent: BattleCard | null;

	state: string;

	constructor(_opponentParty: SolitaireCard[], _playerParty: SolitaireCard[], state: string) {
		this.opponentParty = _.map(_opponentParty, (c) => this.createCard(c));
		this.playerParty = _.map(_playerParty, (c) => this.createCard(c));
		this.state = state || '';
		this.activeOpponent = this.opponentParty[0];
		this.activePlayer = this.playerParty[0];
	}

	/** Starts the battles, returns true if the player won */
	async start(): Promise<boolean> {
		this.state = 'Battling';

		while (this.state == 'Battling') {
			this.opponentTurn();
			this.state = this.checkEndCondition();
			if (this.state != 'Battling') break;
			this.playerTurn();
			this.state = this.checkEndCondition();
			if (this.state != 'Battling') break;
		}

		return this.state == 'Win';
	}

	/** Used to create the battle card data model */
	private createCard(card: SolitaireCard): BattleCard  {
		return {
			id: _.uniqueId('battlecard'),
			health: Number.parseInt(card.cardDef.hp || '100'),
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
		const move = this.pickMove(this.activeOpponent, this.activePlayer);
		this.dealDamage(this.activeOpponent, this.activePlayer, move);
	}

	/**  */
	playerTurn() {
		const move = this.pickMove(this.activePlayer, this.activeOpponent);
		this.dealDamage(this.activePlayer, this.activeOpponent, move);
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
		if (this.activePlayer == null || this.activePlayer.health == 0) {
			this.activePlayer = _.find(this.playerParty, (c) => !c.isKnockedOut) || null;
		}
		if (this.activeOpponent == null || this.activeOpponent.health == 0) {
			this.activeOpponent = _.find(this.opponentParty, (c) => !c.isKnockedOut) || null;
		}

		// Determine
		if (this.activePlayer == null) {
			console.debug('Opponent Won');
			return 'Loss';
		}
		if (this.activeOpponent == null) {
			console.debug('Player Won');
			return 'Win';
		}

		return 'Battling';
	}

	calculateMove(user: BattleCard, attack: Attack): BattleMove {
		const damage = Number.parseInt(attack.damage) || 0;
		return {
			id: _.uniqueId('battlemove'),
			name: attack.name,
			damageCalculation: 'standard',
			damage,
			maxDamage: damage,
			type: _.get(user, 'cardInfo.cardDef.types[0]', Type.Colorless),
			
			setAsleep: false,
			setConfused: false,
			setParalyzed: false,
			setBurned: false,
			setPoisoned: false,
		}
	}

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
		const possibleMoves = _.map(user.cardInfo.cardDef.attacks, (a) => this.calculateMove(user, a));
		return _.orderBy(possibleMoves, 'maxDamage', 'desc')[0];
	}

	/** Updates the models and UI with the damage result */
	dealDamage(user: BattleCard | null, target: BattleCard | null, move: BattleMove) {
		if (user == null || target == null) return;
		let weaknessMultiplier = 1;
		if (_.get(target, 'cardInfo.cardDef.weaknesses[0].type', null) == move.type) weaknessMultiplier = 2;
		let resistanceValue = 0;
		if (_.get(target, 'cardInfo.cardDef.resistances[0].type', null) == move.type) resistanceValue = 3;

		if (move.damageCalculation == 'standard') {
			const damage = Math.max((move.damage * weaknessMultiplier) - resistanceValue, 0);
			target.health = Math.max(target.health - damage, 0)
			console.debug(`${user.cardInfo.cardDef.name} dealt ${damage} damage. (${target.health} left)`);
		}
	}

	/** Returns true if the card is unable to keep playing */
	isKnockedOut(card: BattleCard): boolean {
		return card.health == 0;
	}
}
