<svelte:head>
	<title>Solitaire Adventure</title>
	<meta name="description" content="A solitaire game using Pokemon TCG cards" />
</svelte:head>

<script>
	import titleUrl from '$lib/images/title.png';
	import baseUrl from '$lib/images/tcg-sets/pack-base.png';
	import jungleUrl from '$lib/images/tcg-sets/pack-jungle.png';

    import { fade, fly } from 'svelte/transition';
	import { flip } from "svelte/animate";
	import { onDestroy } from "svelte";
    import { goto } from '$app/navigation';
    import { Stretch } from 'svelte-loading-spinners';
    import { send, receive } from './solitaire/animation-transition';

    const flipDurationMs = 100;

    const TcgSets = [
        { id: 'base1', url: baseUrl },
        { id: 'jungle', url: jungleUrl }
    ];

    let offset = 0;

    let playableTcgSets = [
        { id: null },
        TcgSets[0],
        TcgSets[1],
    ];

    function updatePlayableTcgSets(newOffset) {

    }

    function tutorial() {
        goto('/tutorial');
    }

    function prev() {
        if (offset <= 0) return;
        offset--;
        updatePlayableTcgSets(offset);       
    }

    function play() {
        const activeSet = TcgSets[offset];
        goto(`/game?set=${activeSet.id}`);
    }

    function next() {
        if (offset == TcgSets.length - 1) return;
        offset++;
        updatePlayableTcgSets(offset);
    }



</script>


<div>
    <div class="home-container">
        <div class="title">
                <img alt="Pokemon Solitaire Adventure" src="{titleUrl}" />
        </div>

        <button class="psa--secondary tutorial-button" on:click={tutorial}>?</button>

        <div class="set-select-container">
            {#each playableTcgSets as tcgSet(tcgSet.id)}
            <div class="set-container"
                in:receive={{ key: tcgSet.id }}
                out:send={{ key: tcgSet.id }}
                animate:flip="{{duration: flipDurationMs}}"
            >
                <img class="set" src="{tcgSet.url}" />
            </div>
            {/each}
        </div>

        <div class="tray-container">
            <button class="psa--secondary" on:click={prev}>PREV</button>
            <button class="psa--primary" on:click={play}>PLAY</button>
            <button class="psa--secondary" on:click={next}>NEXT</button>
        </div>
    </div>
</div>


<style>


</style>
