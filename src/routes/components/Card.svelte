<script lang="ts">
	import AttackIcon from './AttackIcon.svelte';
	import Energy from './Energy.svelte';
    import HealthIcon from './HealthIcon.svelte';

    export let card;
    export let isStacked = false;

</script>

<div class="psa--card { isStacked ? 'psa--card_stacked' : ''}">
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