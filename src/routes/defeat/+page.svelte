<svelte:head>
	<title>Solitaire Adventure</title>
	<meta name="description" content="A solitaire game using Pokemon TCG cards" />
</svelte:head>

<script lang="ts">
    import titleUrl from '$lib/images/title.png';
    import sadPikachuUrl from '$lib/images/defeats/crying-pikachu-holding-ketchup.gif';
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

    function tutorial() {
        goto('/tutorial');
    }

    function retry() {
        goto('/game?cardSet='+cardSet);
    }

</script>


<div>
    <div class="home-container">
        <div class="title">
                <img alt="Pokemon Solitaire Adventure" src="{titleUrl}" />
        </div>

        <div class="defeat-container">
            <div class="defeat--title">Defeat</div>
            <div class="defeat--reason">You ran out of moves</div>
            <div class="defeat--image-container"><img src={data.defeatGif} alt="Pikachu Sad About Ketchup"></div>
            <div>
                <button class="psa--secondary defeat--button" on:click={retry}>Retry</button>
                <button class="psa--secondary defeat--button" on:click={home}>Pack Select</button>
                <button class="psa--secondary defeat--button" on:click={tutorial}>Tutorial</button>
            </div>
        </div>
    </div>
</div>


<style>

.defeat-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    align-content: center;
}

.defeat--title {
    font-size: xx-large;
}

.defeat--reason {
    font-size: large;
    margin-bottom: 2rem;
}

.defeat--image-container {
    margin-bottom: 2rem;
}

.defeat--button {
    margin: 0 5px;
}
</style>
