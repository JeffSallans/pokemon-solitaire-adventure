import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { writable, get } from 'svelte/store';
import type { Adventure } from './models/adventure';
import type { GymLeader } from './models/gym-leader';
import * as _ from "lodash";

/** Manages the battle state of a single battle */
export class SolitaireBattle {
	opponentParty: SolitaireCard[];
	playerParty: SolitaireCard[];

	state: string;

	setupBattle()
	start()

	opponentTurn()
	playerTurn()
	checkEndCondition()

	calculateMove(user: BattleCard): BattleMove {
		return {
			id: _.uniqueId('battlecard'),
			name: '',
			damageCalculation: 'standard',
			damage: 0,
			maxDamage: 0,
			type: 'Normal',
			
			setAsleep: false,
			setConfused: false,
			setParalyzed: false,
			setBurned: false,
			setPoisoned: false,
		}
	}

	pickMove(user: BattleCard, target: BattleCard): BattleMove {
		const possibleMoves = _.map(user.attacks, (a) => calculateMove(a));
		return possibleMoves[0];
	}

	/** Updates the models and UI with the damage result */
	dealDamage(user: BattleCard, target: BattleCard, move: BattleMove) {
		const weaknessMultiplier = 1;
		const resistenceValue = 0;
		if (move.damageCalculation == 'standard') {
			target = _.max(target.health - _.max((move.damage * weaknessMultiplier) - resistenceValue, 0), 0)
		}
	}

	/** Returns true if the card is unable to keep playing */
	isKnockedOut(card: BattleCard): boolean {
		return card.health == 0;
	}
}
