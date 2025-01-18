<script lang="ts">
	import AttackIcon from './AttackIcon.svelte';
	import Energy from './Energy.svelte';
    import HealthIcon from './HealthIcon.svelte';

    export let card;
    export let isStacked = false;
    export let isFocused = false;

</script>

<div class="psa--card { isStacked ? 'psa--card_stacked' : ''} { isFocused ? 'psa--card_focused' : ''}">
    <img class="psa--card-image" alt="{card.cardDef.name}" src="{card.cardDef.images.small}"/>
    <div class="psa--card-cover psa--background-{card.type}">
        {#if card.cardDef.supertype == "Trainer"}
        <div class="trainer-move-value">Use for any trade</div>
        {:else}
        <div class="card-attack">{card.attack}<AttackIcon /></div>
        <div class="card-health">{card.maxHealth}<HealthIcon /></div>
        <div class="card-weakness">weak to <Energy energyType={card.weakness} /></div>
        {/if}
    </div>
</div>

<style>
.psa--card_focused .psa--card-image {
    -webkit-box-shadow: 0px 0px 4px 4px rgba(255,255,255,0.9);
    -moz-box-shadow: 0px 0px 4px 4px rgba(255,255,255,0.9);
    box-shadow: 0px 0px 4px 4px rgba(255,255,255,0.9);
}

.trainer-move-value {
    text-align: center;
}
</style>