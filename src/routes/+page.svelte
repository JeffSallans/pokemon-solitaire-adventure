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
        { id: 'base2', url: jungleUrl }
    ];

    let offset = 0;

    let playableTcgSets = [
        { id: null, url: null },
        TcgSets[0],
        TcgSets[1],
    ];

    /**
	 * Returns the new value for playableTcgSets based on the given offset
     * @param {number} newOffset
	 */
    function calculateNewPlayableTcgSets(newOffset) {
        // Base case
        if (newOffset == 0) {
            return [
                { id: null, url: null },
                TcgSets[newOffset],
                TcgSets[newOffset + 1],
            ];
        }

        // End case
        if (newOffset == TcgSets.length - 1) {
            return [
                TcgSets[newOffset - 1],
                TcgSets[newOffset],
                { id: null, url: null },
            ];
        }

        // Offset calculated
        return [
            TcgSets[newOffset - 1],
            TcgSets[newOffset],
            TcgSets[newOffset + 1],
        ];
    }

    function tutorial() {
        goto('/tutorial');
    }

    function prev() {
        if (offset <= 0) return;
        offset--;
        playableTcgSets = calculateNewPlayableTcgSets(offset);       
    }

    function play() {
        const activeSet = TcgSets[offset];
        goto(`/game?cardSet=${activeSet.id}`);
    }

    function next() {
        if (offset == TcgSets.length - 1) return;
        offset++;
        playableTcgSets = calculateNewPlayableTcgSets(offset);
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
