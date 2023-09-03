import { SolitaireGame } from './solitaire-game';
import type { PageLoad } from '../$types';

export async function load(): Promise<PageLoad> {
	const game = new SolitaireGame();
	
	// const pack = (await game.generatePack('base1'));

	game.setupGame([]);

	return {
		//pack,
		stacks: game.stacks,
		currentGymLeader: game.currentGymLeader,
		money: game.money,
		moves: game.money / 10,
		playableAdventures: game.playableAdventures,
		playableBench: game.playableBench,
	};
};

