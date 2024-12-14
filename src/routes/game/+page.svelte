<svelte:head>
	<title>Solitaire Adventure</title>
	<meta name="description" content="A solitaire game using Pokemon TCG cards" />
</svelte:head>

<script>
// @ts-nocheck

    import { fade, fly } from 'svelte/transition';
	import {flip} from "svelte/animate";
	// @ts-ignore
	import { onDestroy } from "svelte";
    import { Stretch } from 'svelte-loading-spinners';
    import iconImage from '$lib/images/icon.png';
	import { SolitaireGame } from "../solitaire/solitaire-game";
    import { send, receive } from '../solitaire/animation-transition';
	import lodash from 'lodash';
	const { range, indexOf } = lodash;

    import MoveIcon from '../components/MoveIcon.svelte';
    import RightArrowIcon from '../components/RightArrowIcon.svelte';
    import Energy from '../components/Energy.svelte';
    import Card from '../components/Card.svelte';


	/** @type {import('./$types').PageData} */

    let game = new SolitaireGame();

    let { moves, stacks, playableAdventures, currentGymLeader, focusCard, inspectCard } = game;
    let { activeOpponent, activePlayer, state } = game.battle;

    const flipDurationMs = 100;

    async function fetchData() {
        const cardSet = (new URLSearchParams(window.location.search)).get('cardSet');
        const packsRes = await fetch(`/pack?cardSet=${cardSet}`);
        const packs = await packsRes.json();
        const gymLeaderRes = await fetch("/leaders");
        const gymLeader = await gymLeaderRes.json();

        game.setupGame(packs, gymLeader.mistyParty, gymLeader.surgeParty, gymLeader.blaineParty);

        if (packsRes.ok) {
            return packs;
        } else {
            throw new Error(packs);
        }
    }

    /** Debugging function to show hidden screen */
    function togglePause() {
        if ($state == 'Battling') {
            $state = 'Paused';
            globalThis.activeOpponent = $activeOpponent;
            globalThis.activePlayer = $activePlayer;
        }
        else {
            $state = 'Battling'
        }
    }

    // @ts-ignore
    globalThis.togglePause = togglePause;
    console.log("DEBUG: run togglePause() to stop the game during battle.")
    console.log("DEBUG: Variables available for details. inspectCard, focusCard, activePlayer, activeOpponent")

</script>


<div>
    <div class="title-container">
        <img class="title-icon" alt="pokemon-solitaire-adventure" src="{iconImage}"/>
        <div class="title-moves money">Moves Left: 
            {#each {length: $moves} as _, i} <MoveIcon />{/each}
        </div>
    </div>
    {#await fetchData()}
        <div class="spinner-container">
            <div class="spinner-container-goal">
                Defeat 3 gym leaders before running out of moves!
            </div>
            <Stretch size="120" color="#f9ea0c" unit="px" duration="1s" />
        </div>
    {:then result}
    <div class="game-container">

        <div class="main-container">
            <div class="gym">
                <div class="gym-leader-container">
                    <img class="gym-leader-portrait" alt="{$currentGymLeader.name}" src="{$currentGymLeader.imageUrl}"/>
                </div>
                <div class="gym-party-container">
                    {#each $currentGymLeader.party as card(card.id)}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class="gym-party-card" 
                            in:fly={{ y: -300 }}
                            out:fade
                            animate:flip="{{duration: flipDurationMs}}"
                            on:click={(e) => game.onInspectClick(card)}
                        >
                        <Card card={card}/>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="battle-button-container">
                <button class="psa--primary gym-start-button" on:click={(e) => game.startBattle()}>
                    Battle
                    <div class="gym-start-cost">Cost 1 <MoveIcon /></div>
                </button>
            </div>
        
            <div class="stack-container">
                {#each $stacks as stack, i}
                <div class="stack"
                    bind:this={game.stackRefs[i]}
                >
                    {#each stack as card(card.id)}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class="psa--card" 
                            in:receive={{ key: card.id }}
                            out:send={{ key: card.id }}
                            animate:flip="{{duration: flipDurationMs}}"
                            on:click={(e) => game.onInspectClick(card)}
                        >
                            <Card card={card} isStacked=true></Card>
                        </div>
                    {/each}
                    <div class="psa--card card-empty"> </div>
                    {#if $focusCard != null && game.draggingCardLastStackIndex == i}
                        <button class="psa--secondary" on:click={game.onStackClick(i)}>Back</button>
                    {:else if $focusCard != null}
                        <button class="psa--secondary" on:click={game.onStackClick(i)}>Move</button>
                    {:else if $focusCard == null}
                        <button class="psa--secondary" on:click={game.onCardClick(stack[stack.length - 1], i)}>Select</button>
                    {/if}
                </div>
                {/each}
            </div>
        </div>

        <div class="bottom-container">

            <div class="inspect-container">
                {#if $focusCard != null}
                {#key $focusCard.id}
                <div class="inspect-card"
                    in:fade
                >
                    <Card card={$focusCard} />
                </div>
                {/key}
                {:else if $inspectCard != null}
                {#key $inspectCard.id}
                <div class="inspect-card"
                    in:fade
                >
                    <Card card={$inspectCard} />
                </div>
                {/key}
                {/if}
            </div>
    
            <div class="adventure-container">
                {#each $playableAdventures as adv(adv.id)}
                    <div class="adventure"
                        in:fly={{y:-200}}
                        out:fade
                        animate:flip="{{duration: flipDurationMs}}"
                        bind:this={game.adventureRefs[adv.id]}
                    >
                        <div class="adventure-trade">
                            <Energy class="adventure-energy" energyType={adv.conditionEnergy[0]} />
                            <RightArrowIcon class="adventure-arrow" />
                            <span class="adventure-moves"><MoveIcon /><MoveIcon /></span>
                        </div>
                        {#if $focusCard != null && game.isAdventureEligible(adv)}
                            <button class="psa--secondary adventure-button" on:click={game.onAdventureClick(adv)}>Trade</button>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>

    {#if $state == 'Battling' || $state == 'Paused'}
    <div class="battle-container">
        <div class="battle-background-1">
            <div class="battle-background-ray battle-background-ray-1"></div>
            <div class="battle-background-ray battle-background-ray-2"></div>
            <div class="battle-background-ray battle-background-ray-3"></div>
            <div class="battle-background-ray battle-background-ray-4"></div>
        </div>

        <div class="battle-cards">
            {#if $activePlayer != null}
            <div class="battle-my-card">
                <!-- Card -->
                {#key $activePlayer.id}
                    <div class="battle-card" 
                        in:fly={{x:-100}}
                        out:fade
                    >
                        <Card card={$activePlayer.cardInfo} />
                    </div>
                {/key}
                <!-- Health Counters -->
                <div class="battle-health">
                    {#each range(0, $activePlayer.maxHealth / 10) as i}
                        {#if (i+1) * 10 <= $activePlayer.health}
                            <div 
                            out:fly={{y:100, duration: 200}}
                            class="battle-health-increment battle-health-increment-filled"></div>
                        {:else}
                            <div
                            in:fade={{delay: 200}}
                            class="battle-health-increment"></div>
                        {/if}
                    {/each}
                </div>
            </div>
            {/if}
    
            {#if $activeOpponent != null}
            <div class="battle-opp-card">
                <!-- Card -->
                {#key $activeOpponent.id}
                    <div class="battle-card" 
                        in:fly={{x:-100}}
                        out:fade
                    >
                        <Card card={$activeOpponent.cardInfo} />
                    </div>
                {/key}
                <!-- Health Counters -->
                <div class="battle-health">
                    {#each range($activeOpponent.maxHealth / 10) as i}
                        {#if (i+1) * 10 <= $activeOpponent.health}
                            <div 
                            out:fly={{y:100, duration: 200}}
                            class="battle-health-increment battle-health-increment-filled"></div>
                        {:else}
                            <div
                            in:fade={{delay: 200}}
                            class="battle-health-increment"></div>
                        {/if}
                    {/each}
                </div>
            </div>
            {/if}
        </div>

        <div class="battle-text"></div>
        <div class="battle-win"></div>
        <div class="battle-lose"></div>
    </div>
    {/if}

    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
</div>


<style>
.spinner-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
}

.spinner-container-goal {
    font-size: 3rem;
    text-align: center;
}

.game-container {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: space-around;
    justify-content: center;
    align-items: flex-start;
}

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
    min-width: 18rem;

    background: #afaab833;
    border-radius: 10px;
    margin: 5px;
    padding: 1rem;
}

.adventure-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-evenly;
    align-items: center;
    margin-bottom: 1rem;

    width: 40rem;
    min-width: 40rem;
    padding: 2rem;
}

.adventure {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 27rem;
    text-align: center;
    vertical-align: middle;
    color: white;
    margin-bottom: 3rem;
}

.adventure-button.adventure-button {
    position: absolute;
    height: 7rem;
    width: fit-content;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    padding-left: 3rem;
    padding-right: 3rem;
}

:global(.adventure .psa--icon svg) {
    width: 6rem;
    height: 6rem;
    fill: white;
}

:global(.adventure .psa--energy) {
    width: 6rem;
    height: 6rem;
}

.title-container {
    display: flex;
    height: 15rem;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;
    margin-top: 2rem;
    margin-bottom: 2rem;
}

img.title-icon {
    height: 15rem;
    width: 15rem;
}

.title-moves {
    height: 15rem;
    width: calc(100% - 22rem);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    
    color: white;
    fill: white;

    margin-bottom: 1rem;
    padding: 1rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    text-align: center;
    font-size: 3rem;
    border-radius: 12px;
}

:global(.title-moves svg) {
    width: 4rem;
    height: 4rem;
}

.gym {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1rem;
}

.gym-party-card {
    display: inline-block;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    /* height: 5rem; */
}

.gym-leader-container {
    display: inline-block;
    width: 12rem;
    margin-right: 1rem;
}

img.gym-leader-portrait {
    width: 12rem;
}

.gym-party-container {
    display: inline-block;
}

@property --myColor1 {
  syntax: '<color>';
  initial-value: rgba(36,4,0,1);
  inherits: false;
}

@property --myColor2 {
  syntax: '<color>';
  initial-value: rgba(121,24,9,1);
  inherits: false;
}

@property --myColor3 {
  syntax: '<color>';
  initial-value: rgba(222,68,2,1);
  inherits: false;
}

@property --myColor4 {
  syntax: '<color>';
  initial-value: rgba(255,175,0,1);
  inherits: false;
}

.battle-button-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: stretch;
    padding-top: 5px;
    padding-bottom: 5px;
}

.battle-button-container button.gym-start-button {
    height: 10rem;
    padding-top: 2px;
    padding-bottom: 2px;
    border-radius: 15px;
    font-size: x-large;
}

.battle-button-container .gym-start-cost {
    font-size: large;
}

.battle-container {
    position: fixed;
    display: block;
    height: 100vh;
    width: 100vw;
    background: #0000009c;
    left: 0;
    top: 0;
    z-index: 1000;
}

.battle-background-1 {
    position: absolute;
    display: inline-block;
    width: 100vw;
    height: 250px;
    background: rgb(60,91,235);
    background: linear-gradient(0deg, rgba(60,91,235,1) 0%, rgba(255,255,255,1) 50%, rgba(60,91,235,1) 100%);
    top: calc(50vh - 125px);
}

.battle-background-ray {
    background: #ffffff65;
    height: 1rem;
    width: 30rem;
    border-radius: 2px;
    position: absolute;
}

.battle-background-ray-1 {
    top: 30px;
    left: 200px;
    animation: battle-background-ray-slide 3.5s linear 0s infinite normal forwards;
}

.battle-background-ray-2 {
    top: 100px;
    left: 10px;
    animation: battle-background-ray-slide 3.8s linear 0s infinite normal forwards;
}

.battle-background-ray-3 {
    top: 180px;
    left: 300px;
    animation: battle-background-ray-slide 4.2s linear 0s infinite normal forwards;
}

.battle-background-ray-4 {
    top: 160px;
    left: -200px;
    animation: battle-background-ray-slide 4s linear 0s infinite normal forwards;
}

@keyframes battle-background-ray-slide {
	0% {
		transform: translateX(-50vw);
	}

	100% {
		transform: translateX(150vw);
	}
}

.battle-cards {
    position: relative;
    display: flex;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100%;
}

.battle-health-increment {
    position: relative;
    display: inline-block;
    width: 1.5rem;
    height: 2rem;
    background: #e3fbe3;
    margin-right: 2px;
    border-radius: 8px;
}

.battle-health-increment.battle-health-increment-filled {
    background: #53ef53;
}

.inspect-container {
    padding: 2rem;
    width: 100%;
    max-width: 55rem;
}

:global(.inspect-card .psa--card) {
    width: 100%;
}

:global(.inspect-card .psa--card .psa--card-image) {
    width: 100%;
}

:global(.inspect-card .psa--card .psa--card-cover) {
    height: auto;
    bottom: 0rem;
    top: 30rem;
    font-size: x-large;
}

.bottom-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    min-width: 88rem;
}

</style>
