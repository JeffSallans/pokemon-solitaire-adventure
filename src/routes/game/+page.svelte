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

	/** @type {import('./$types').PageData} */

    let game = new SolitaireGame();

    let { moves, stacks, playableAdventures, currentGymLeader, focusCard } = game;
    let { activeOpponent, activePlayer, state } = game.battle;

    const flipDurationMs = 100;

    async function fetchData() {
        const packsRes = await fetch("/pack");
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

</script>


<div>
    <div class="title-container">
        <img class="title-icon" alt="pokemon-solitaire-adventure" src="{iconImage}"/>
        <div class="title-moves money">{$moves} moves left</div>
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
                    <button class="gym-start-button" on:click={(e) => game.startBattle()}>Battle</button>
                    <div class="gym-start-cost">Cost 1 Move</div>
                </div>
                <div class="gym-party-container">
                    {#each $currentGymLeader.party as card(card.id)}
                        <div class="gym-party-card" 
                            in:fly={{ y: -300 }}
                            out:fade
                            animate:flip="{{duration: flipDurationMs}}"
                            on:mouseenter={game.onHover(card)}
                            on:mouseleave={game.onHoverExit(card)}
                        >
                            <img class="gym-party-card-image" alt="{card.name}" src="{card.images.small}"/>
                        </div>
                    {/each}
                </div>
            </div>
        
            <div class="stack-container">
                {#each $stacks as stack, i}
                <div class="stack"
                    bind:this={game.stackRefs[i]}
                >
                    {#each stack as card(card.id)}
                        <div class="card" 
                            in:receive={{ key: card.id }}
                            out:send={{ key: card.id }}
                            animate:flip="{{duration: flipDurationMs}}"
                        >
                            {#if $focusCard == null && indexOf(stack, card) == stack.length - 1}
                                <button class="psa--image" on:click={game.onCardClick(card, i)}>
                                    <img class="card-image" alt="{card.cardDef.name}" src="{card.cardDef.images.small}"/>
                                </button>
                            {:else}
                                <img class="card-image" alt="{card.cardDef.name}" src="{card.cardDef.images.small}"/>
                            {/if}
                        </div>
                    {/each}
                    <div class="card card-empty"> </div>
                    {#if $focusCard != null && game.draggingCardLastStackIndex == i}
                        <button class="psa--secondary" on:click={game.onStackClick(i)}>Back</button>
                    {:else if $focusCard != null}
                        <button class="psa--secondary" on:click={game.onStackClick(i)}>Move</button>
                    {/if}
                </div>
                {/each}
            </div>
        </div>

        <div class="inspect-container">
            {#if $focusCard != null}
            {#key $focusCard.id}
            <div class="inspect-card"
                in:fade
            >
                <img class="inspect-card-image" alt={$focusCard.name} src={$focusCard.images.large} />
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
                    <img class="adventure-image" alt="{adv.name}" src="{adv.imageUrl}" data-drag-consider="false"/>
                    <div class="adventure-text">{adv.name}</div>

                    <div class="adventure-card-zone">
                        <img class="adventure-energy" alt="energy" src="{adv.energyUrl}"/>
                    </div>
                    {#if $focusCard != null}
                        <button class="psa--secondary" on:click={game.onAdventureClick(adv)}>Use</button>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    {#if $state == 'Battling'}
    <div class="battle-container">
        <div class="battle-background-1"></div>
        <div class="battle-background-2"></div>
        <div class="battle-background-3"></div>

        <div class="battle-cards">
            {#if $activePlayer != null}
            <div class="battle-my-card">
                <!-- Card -->
                {#key $activePlayer.id}
                    <div class="battle-card" 
                        in:fly={{x:-100}}
                        out:fade
                    >
                        <img class="battle-card-image" alt="{$activePlayer.cardInfo.cardDef.name}" src="{$activePlayer.cardInfo.cardDef.images.small}"/>
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
                        <img class="battle-card-image" alt="{$activeOpponent.cardInfo.cardDef.name}" src="{$activeOpponent.cardInfo.cardDef.images.small}"/>
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

.card {
    height: 5rem;
}

.card.card-empty {
    height: 20rem
}

.card-image {
    width: 18rem;
    border-radius: 10px;
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
    width: 48rem;
    height: 27rem;
    background: grey;
    text-align: center;
    vertical-align: middle;
    color: white;
    margin-bottom: 3rem;
}

.adventure-text {
    display: block;
    position: absolute;

    top: 0;
    font-size: 2rem;
    text-align: center;
    width: 40rem;
    background: #00000052;

}

.adventure-image {
    width: 40rem;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1);

    transition-property: filter;
    transition-duration: 500ms;
}

.adventure:not([data-drag-consider="false"]) .adventure-image {
    filter: grayscale(0);
}

.adventure-image.adventure-image:not([data-drag-consider="false"]) {
    filter: grayscale(0);
}

.adventure-card-zone {
    position: absolute;
    right: 1rem;
    top: 0rem;
    bottom: 0rem;
    margin: auto 0;
    height: 18rem;
    background: #808080ba;
    border-radius: 12px;
    border: 5px solid #0000008f;
    width: 13rem;
    pointer-events: none;
}

img.adventure-energy {
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    height: 4rem;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;

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

.gym {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
}

.gym-party-card {
    display: inline-block;
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

img.gym-party-card-image {
    width: 18rem;
    margin: .5rem;
    max-width: 28vw;
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

button.gym-start-button {
    width: 12rem;
    height: 3rem;
    background: rgb(36,4,0);
    background: linear-gradient(8deg, var(--myColor1) 0%, var(--myColor2) 51%, var(--myColor3) 92%, var(--myColor4) 100%);
    color: #ebcccc;
    font-weight: bold;
    transition: --myColor1, --myColor2, --myColor3, --myColor4;
    transition-duration: 500ms;
}

button.gym-start-button:hover {
    --myColor1: rgba(36,4,0,1);
    --myColor2: rgba(180,50,5,1);
    --myColor3: rgba(245,144,1,1);
    --myColor4: rgba(255,175,0,1);
}

.gym-start-cost {
    text-align: center;
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
    background: #3c5beb;
    top: calc(50vh - 125px);
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

img.inspect-card-image {
    border-radius: 15px;
    width: 30rem;
}

.inspect-container {
    padding: 2rem;
    min-width: 34rem;
}

</style>
