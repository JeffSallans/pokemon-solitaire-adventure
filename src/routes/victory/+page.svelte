<svelte:head>
	<title>Solitaire Adventure</title>
	<meta name="description" content="A solitaire game using Pokemon TCG cards" />
</svelte:head>

<script lang="ts">
    import titleUrl from '$lib/images/title.png';
    import pikachuDanceUrl from '$lib/images/victories/pikachu-dance.gif';
	import { flip } from "svelte/animate";
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const cardSet = $page.url.searchParams.get('cardSet') || 'base1';

    const flipDurationMs = 100;

    function home() {
        goto('/');
    }

</script>


<div>
    <div class="home-container">
        <div class="title">
                <img alt="Pokemon Solitaire Adventure" src="{titleUrl}" />
        </div>

        <div class="victory-container">
            <div class="victory--title">Victory</div>
            <div class="victory--reason">Congratulations on completing challenge {cardSet}!</div>
            <div class="victory--image-container"><img src={data.victoryGif} alt="Pikachu Dance"></div>
            <button class="psa--secondary victory--try-again" on:click={home}>Pack Select</button>
        </div>
    </div>
</div>


<style>

.victory-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    align-content: center;
}

.victory--title {
    font-size: xx-large;
}

.victory--reason {
    font-size: large;
    margin-bottom: 2rem;
}

.victory--image-container {
    margin-bottom: 2rem;
}

</style>
