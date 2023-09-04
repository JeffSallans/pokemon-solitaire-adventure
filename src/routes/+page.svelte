<svelte:head>
	<title>Solitaire Adventure</title>
	<meta name="description" content="A solitaire game using Pokemon TCG cards" />
</svelte:head>

<script>
	import {flip} from "svelte/animate";
	import {dndzone} from "svelte-dnd-action";
	import { SolitaireGame } from "./solitaire/solitaire-game";
	import { onDestroy } from "svelte";

	/** @type {import('./$types').PageData} */
	export let data;

    let game = new SolitaireGame();
    game.setupGame(data.packs);

    let { moves } = game;
    let { stacks } = game;

    const flipDurationMs = 100;
    
</script>

<div>
	<h1>Gym Leader: {game.currentGymLeader.name}</h1>

	<div class="money">{$moves} moves left</div>

	<div class="adventure-container">
		{#each game.playableAdventures as adv(adv.id)}
			<div class="adventure"
                on:dragenter={game.onAdventureHoverEnter(adv)} 
                on:dragleave={game.onAdventureHoverExit(adv)}  
                on:drop={game.onAdventureDrop(adv)}
                ondragover="return false"
            >
                {adv.name}
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
    min-width: 64rem;
}

.stack {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
    min-width: 240px;
}

.card {
    height: 9rem;
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
    width: 15rem;
    height: 5rem;
    background: grey;
    text-align: center;
    vertical-align: middle;
    color: white;
}

.money {
    text-align: center;
    font-size: 3rem;
    margin-bottom: 1rem;
}
</style>
