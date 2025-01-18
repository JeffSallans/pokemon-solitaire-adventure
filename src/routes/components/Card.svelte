<script lang="ts">
    import AttackIcon from './AttackIcon.svelte';
	import Energy from './Energy.svelte';
    import HealthIcon from './HealthIcon.svelte';
	import StarIcon from './StarIcon.svelte';
	import StarOutlineIcon from './StarOutlineIcon.svelte';

    export let card;
    export let isStacked = false;
    export let isFocused = false;
    export let showDetailInfo = false;

</script>

<div class="psa--card { isStacked ? 'psa--card_stacked' : ''} { isFocused ? 'psa--card_focused' : ''} { !showDetailInfo ? 'psa--card_hidedetails' : ''}">
    <img class="psa--card-image" alt="{card.cardDef.name}" src="{card.cardDef.images.small}"/>
    <div class="psa--card-cover psa--background-{card.type}">
        {#if card.cardDef.supertype == "Trainer"}
        <div class="trainer-move-value">Use for any trade</div>
        {:else}
        <div class="card-attack">{card.attack}<AttackIcon />{#if !card.isUpgraded}<span class="card-upgrade-value">{#if card.upgradeAttack > 0}+{/if}{card.upgradeAttack}</span>{/if}</div>
        <div class="card-health">{card.maxHealth}<HealthIcon />{#if !card.isUpgraded}<span class="card-upgrade-value">{#if card.upgradeHealth > 0}+{/if}{card.upgradeHealth}</span>{/if}</div>
        <div class="card-weakness">weak to <Energy energyType={card.weakness} /></div>
            {#if card.isUpgraded}
            <div class="card-upgrade"><StarIcon /></div>
            {:else}
            <div class="card-upgrade"><StarOutlineIcon /></div>
            {/if}
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

.card-upgrade-value {
    position: absolute;
    color: dimgrey;
    font-size: medium;
    margin-top: 6px;
    margin-left: 5px;
}

.psa--card_hidedetails .card-upgrade-value {
    display: none;
}

.card-upgrade {
    position: absolute;
    top: 1rem;
    right: 2rem;
}

.psa--card_hidedetails .card-upgrade {
    top: .5rem;
    right: 1rem;
}

</style>