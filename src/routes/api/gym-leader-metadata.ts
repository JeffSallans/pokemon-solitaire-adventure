import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { findCardByID } from './pokemon-api-cache/api-cache';
import pkg from 'lodash';
const { uniqueId } = pkg;

import mistyImage from '$lib/images/trainers/misty.png';
import surgeImage from '$lib/images/trainers/surge.png';
import blaineImage from '$lib/images/trainers/blaine.png';
import pikachuVictoryImage from '$lib/images/victories/pikachu-dance.gif';
import pikachuDefeatImage from '$lib/images/defeats/crying-pikachu-holding-ketchup.gif';
import baseImage from '$lib/images/tcg-sets/pack-base.png';

import erikaImage from '$lib/images/trainers/erika.png';
import kogaImage from '$lib/images/trainers/koga.png';
import sabrinaImage from '$lib/images/trainers/sabrina.png';
import jungleImage from '$lib/images/tcg-sets/pack-jungle.png';

let gymLeaderMetadata: any = null;

/** Returns the full level configuration for every set */
export async function getGymLeaderMetadata() {
	if (gymLeaderMetadata != null) return gymLeaderMetadata;

	gymLeaderMetadata = {
		base1: {
			packUrl: baseImage,
			victoryGif: pikachuVictoryImage,
			defeatGif: pikachuDefeatImage,
			firstLeader: {
				name: 'Misty',
				/** Assuming file path from src/lib/images/trainers/ */
				imageUrl: mistyImage,
				party: [
					await findCardByID('base1-65'), // Staryu 20/40
					await findCardByID('base1-59'), // Poliwag 10+/40
					await findCardByID('base1-64'), // Starmie 20/60
				],
			},
			secondLeader: {
				name: 'Surge',
				imageUrl: surgeImage,
				party: [
					await findCardByID('base1-67'), // Voltorb 10/40
					await findCardByID('base1-20'), // Electabuzz 30+/70
					await findCardByID('base1-21'), // Electrode 50/80
					await findCardByID('base1-14'), // Raichu 60/80
				],
			},
			thirdLeader: {
				name: 'Blaine',
				imageUrl: blaineImage,
				party: [
					await findCardByID('base1-60'), // Ponyta 30/40 
					await findCardByID('base1-36'), // Magmar 50/50
					await findCardByID('base1-46'), // Charmander 50/80
					await findCardByID('base1-12'), // Ninetails 80/80
				]
			},
			adventures: [
				{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire], consider: false},
				{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Psychic], consider: false},
				{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water], consider: false},
			]
		},
		base2: {
			packUrl: jungleImage,
			victoryGif: pikachuVictoryImage,
			defeatGif: pikachuDefeatImage,
			firstLeader: {
				name: 'Erica',
				/** Assuming file path from src/lib/images/trainers/ */
				imageUrl: erikaImage,
				party: [
					await findCardByID('base2-58'), // Odish 
					await findCardByID('base2-41'), // Parisect 
					await findCardByID('base2-15'), // Viloaplum - Star?
				],
			},
			secondLeader: {
				name: 'Koga',
				imageUrl: kogaImage,
				party: [
					await findCardByID('base1-51'), // Koffing
					await findCardByID('base1-51'), // Koffing
					await findCardByID('base3-45'), // Weezing 60/60
					await findCardByID('base3-13'), // Muk - Star?
				],
			},
			thirdLeader: {
				name: 'Sabrina',
				imageUrl: sabrinaImage,
				party: [
					await findCardByID('base2-6'), // Mr mime - Star?
					await findCardByID('base2-13'), // Venomoth
					await findCardByID('base1-32'), // Kadabra 
					await findCardByID('base1-1'), // Alakazam - Star?
				]
			},
			adventures: [
				{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Grass], consider: false},
				{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting], consider: false},
				{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Colorless], consider: false},
			]
		},
	};

	return gymLeaderMetadata;
}

/** Returns the full level configuration for the given set, or base1 set config */
export async function getGymLeaderMetadataBySet(set: string) {
	const gymLeaderMetadata = await getGymLeaderMetadata();
	if (gymLeaderMetadata[set] != null) {
		return gymLeaderMetadata[set];
	}

	return gymLeaderMetadata['base1'];
}
