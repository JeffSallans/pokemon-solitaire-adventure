<svelte:head>
	<title>Solitaire Adventure</title>
	<meta name="description" content="A solitaire game using Pokemon TCG cards" />
</svelte:head>

<script>
    import { fade, fly } from 'svelte/transition';
	import {flip} from "svelte/animate";
	import {dndzone} from "svelte-dnd-action";
	import { onDestroy } from "svelte";
	import GymLeader from "./GymLeader.svelte";
	import { SolitaireGame } from "./solitaire/solitaire-game";
    import { send, receive } from './solitaire/animation-transition';

	/** @type {import('./$types').PageData} */
	export let data;

    let game = new SolitaireGame();
    game.setupGame(data.packs, data.mistyParty);

    let { moves } = game;
    let { stacks } = game;

    const flipDurationMs = 100;

</script>

<div>
    <div class="gym">
        <div class="gym-leader-container">
            <img class="gym-leader-portrait" alt="{game.currentGymLeader.name}" src="{game.currentGymLeader.imageUrl}"/>
        </div>
        <div class="gym-party-container">
            <div class="gym-party-card"></div>
        </div>
        <div class="gym-start-container">
            <div class="gym-start-cost">Cost 1 Move</div>
            <button class="gym-start-button" on:click={(e) => game.startBattle()}>Battle</button>
        </div>
    
        <div class="gym-battle-container">
            <div class="gym-battle-start-text"></div>
            <div class="gym-battle-ko-text"></div>
            <div class="gym-battle-win-text"></div>
            <div class="gym-battle-loss-text"></div>
    
            <div class="gym-battle-active-player">

            </div>
    
            <div class="gym-battle-active-opponent">
                
            </div>
    
        </div>
    </div>

	<div class="money">{$moves} moves left</div>

	<div class="adventure-container">
		{#each game.playableAdventures as adv(adv.id)}
			<div class="adventure"
                out:fade
                on:dragenter={game.onAdventureHoverEnter(adv)} 
                on:dragleave={game.onAdventureHoverExit(adv)}  
                on:drop={game.onAdventureDrop(adv)}
                ondragover="return false"
            >
                <img class="adventure-image" alt="{adv.name}" src="{adv.imageUrl}" />
                <div class="adventure-text">{adv.name}</div>
            </div>
		{/each}
	</div>

	<div class="stack-container">
		{#each $stacks as stack, i}
		<div class="stack"
            on:dragenter={game.onStackHoverEnter(i)} 
            on:dragleave={game.onStackHoverExit(i)}  
            on:drop={game.onStackDrop(i)}
            ondragover="return false"
        >
			{#each stack as card(card.id)}
				<div class="card" 
                    in:receive={{ key: card.id }}
                    out:send={{ key: card.id }}
                    animate:flip="{{duration: flipDurationMs}}"
                    draggable={game.playableBench.indexOf(card) > -1}
                    on:dragstart={game.dragCard(card, i)}
                    on:dragend={game.dropCard()}
                    on:touchstart={game.dragCard(card, i)}
                    on:touchend={game.dropCard()}
                >
					<img class="card-image" alt="{card.cardDef.name}" src="{card.cardDef.images.small}"/>
				</div>
			{/each}
			<div class="card"> </div>
		</div>
		{/each}
	</div>

</div>

<style>
.stack-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-evenly;
    align-items: flex-start;
    min-width: 60rem;
}

.stack {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
    min-width: 200px;

    background: #afaab833;
    border-radius: 10px;
    margin: 5px;
    padding: 1rem;
}

.card {
    height: 9rem;
}

.card-image {
    width: 200px;
    border-radius: 10px;
}

.adventure-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-evenly;
    align-items: center;
    min-width: 64rem;
    margin-bottom: 1rem;
}

.adventure {
    display: inline-block;
    position: relative;
    width: 16rem;
    height: 9rem;
    background: grey;
    text-align: center;
    vertical-align: middle;
    color: white;
}

.adventure-text {
    display: block;
    position: absolute;

    top: 0;
    font-size: 1.5rem;
    text-align: center;
    width: 16rem;
    background: #00000052;
}

.adventure-image {
    width: 16rem;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1);
}

.money {
    position: fixed;
    bottom: 0;
    background: rgb(2,0,36);
    background: linear-gradient(8deg, rgba(2,0,36,1) 0%, rgba(9,38,121,1) 51%, rgba(2,143,222,1) 92%, rgba(0,177,255,1) 100%);
    
    color: white;
    
    margin-bottom: 1rem;
    padding: 1rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    
    text-align: center;
    font-size: 3rem;
    border-radius: 12px;

}
</style>
