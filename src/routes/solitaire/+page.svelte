<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<script>
	import {flip} from "svelte/animate";
	import {dndzone} from "svelte-dnd-action";

	/** @type {import('./$types').PageData} */
	export let data;

    let moves = data.moves;

    const flipDurationMs = 100;
	const handleDndConsider = (index) => (e) => {
        if (moves <= 0) return;
        data.stacks[index] = e.detail.items;
    }
	const handleDndFinalize = (index) => (e) => {
        if (moves <= 0) return;
        data.stacks[index] = e.detail.items;
        moves--;
    }
</script>

<div>
	<h1>Gym Leader: {data.currentGymLeader.name}</h1>

	<div class="money">{moves} moves left</div>

	<div class="adventure-container">
		{#each data.playableAdventures as adv}
			<div class="adventure">{adv.name}</div>
		{/each}
	</div>

	<div class="stack-container">
		{#each data.stacks as stack, i}
		<div class="stack" use:dndzone="{{items: stack, flipDurationMs}}" on:consider="{handleDndConsider(i)}" on:finalize="{handleDndFinalize(i)}">
			{#each stack as card(card.id)}
				<div class="card" animate:flip="{{duration: flipDurationMs}}">
					<img class="card-image" src="{card.images.small}"/>
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
