import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
import { json } from '@sveltejs/kit';
import { findCardByID } from '../pokemon-api-cache/api-cache';
import pkg from 'lodash';
const { includes, uniqueId } = pkg;

import mistyImage from '$lib/images/trainers/misty.png';
import surgeImage from '$lib/images/trainers/surge.png';
import blaineImage from '$lib/images/trainers/blaine.png';

const leaders = {
	base1: {
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
			{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting], consider: false},
			{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water], consider: false},
		]
	},
	base2: {
		firstLeader: {
			name: 'Erica',
			/** Assuming file path from src/lib/images/trainers/ */
			imageUrl: mistyImage,
			party: [
				await findCardByID(''), // Odish 
				await findCardByID(''), // Parisect 
				await findCardByID(''), // Viloaplum - Star?
			],
		},
		secondLeader: {
			name: 'Koga',
			imageUrl: surgeImage,
			party: [
				await findCardByID(''), // Koffing
				await findCardByID(''), // Koffing
				await findCardByID('base3-45'), // Weezing 60/60
				await findCardByID('base3-13'), // Muk - Star?
			],
		},
		thirdLeader: {
			name: 'Sabrina',
			imageUrl: blaineImage,
			party: [
				await findCardByID(''), // Mr mime - Star?
				await findCardByID(''), // Venomoth
				await findCardByID(''), // Abra 
				await findCardByID(''), // Alakazam - Star?
			]
		},
		adventures: [
			{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fire], consider: false},
			{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Fighting], consider: false},
			{ id: uniqueId('adv'), reward: 2, conditionType: 'energy', conditionEnergy: [PokemonTCG.Type.Water], consider: false},
		]
	},
}


/**
 * Returns the gym leader details
 */
export async function GET(request: { url: { searchParams: { get: (arg0: string) => string; }; }; }) {
	let cardSet = request.url.searchParams.get('cardSet') || '';
	let cleanCardSet = 'base1';
	let availableSets = ['base1', 'base2'];
	if (includes(availableSets, cardSet)) {
		cleanCardSet = cardSet;
	}

	// @ts-ignore
	let leadersForSet = leaders[cleanCardSet];
	
	// Set default if param
	if (leadersForSet == null) {
		leadersForSet = leaders.base1;
	}

	return json(leadersForSet);
}
