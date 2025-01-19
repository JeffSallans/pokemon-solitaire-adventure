<svelte:head>
	<title>Solitaire Adventure</title>
	<meta name="description" content="A solitaire game using Pokemon TCG cards" />
</svelte:head>

<script>
    import titleUrl from '$lib/images/title.png';
    import trainerUrl from '$lib/images/tutorial/tutorial-trainer.png';
    import movesHeaderUrl from '$lib/images/tutorial/tutorial-moves-left.png';
    import stacksUrl from '$lib/images/tutorial/tutorial-stack.png';
    import tradeAndUpgradeUrl from '$lib/images/tutorial/tutorial-trade-and-upgrade.png';
    import battleUrl from '$lib/images/tutorial/tutorial-battle.png';

    import { goto } from '$app/navigation';
	import MoveIcon from '../components/MoveIcon.svelte';
	import StarIcon from '../components/StarIcon.svelte';
    

    function home() {
        goto('/');
    }

</script>


<div>
    <div class="home-container">
        <div class="title">
                <img alt="Pokemon Solitaire Adventure" src="{titleUrl}" />
        </div>

        <div class="tutorial-container">
            <div class="tutorial--title">Tutorial</div>
            <div class="tutorial--reason">Defeat 3 trainers before you run out of moves (<MoveIcon />)</div>
            <div class="tutorial--image-container"><img src={trainerUrl} alt="trainer"></div>
            <div class="tutorial--reason">You can see the moves left at the top of the screen.</div>
            <div class="tutorial--image-container"><img src={movesHeaderUrl} alt="moves"></div>
            <div class="tutorial--reason">You start with 4 stack of cards. You can only interact with the top card on each stack.</div>
            <div class="tutorial--reason">You can use <MoveIcon /> to move, upgrade, or battle the top cards in each stack.</div>
            <div class="tutorial--image-container"><img src={stacksUrl} alt="stacks"></div>
            <div class="tutorial--reason">To get more <MoveIcon /> by trading a top card if its a trainer or the needed engergy type.</div>
            <div class="tutorial--reason">When you don't have a card selected, tap or click any card to see a larger version.</div>
            <div class="tutorial--reason">You can upgrade a card once, indicated by <StarIcon />. This will increase a cards stats for battle.</div>
            <div class="tutorial--image-container"><img src={tradeAndUpgradeUrl} alt="trade and upgrade"></div>
            <div class="tutorial--reason">When you battle the top cards in your stacks battle the trainers cards going left to right.</div>
            <div class="tutorial--reason">Losing to a trainer will cost you 1 <MoveIcon />.</div>
            <div class="tutorial--reason">Beating a trainer, will add more cards to the top of your stacks.</div>
            <div class="tutorial--image-container"><img src={battleUrl} alt="battle"></div>
            <button class="psa--secondary tutorial--try-again" on:click={home}>Back</button>
        </div>
    </div>
</div>


<style>

.tutorial-container {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    align-content: center;
    padding-left: 3rem;
}

.tutorial--title {
    font-size: x-large;
    margin-bottom: 1rem;
}

.tutorial--reason {
    font-size: medium;
    margin-bottom: 2rem;
}

.tutorial--image-container {
    margin-bottom: 2rem;
}

.tutorial--image-container img {
    max-width: 40vw;
    padding: 10px;
    border: solid 2px grey;
}

</style>
