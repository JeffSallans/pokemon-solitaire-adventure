<script lang="ts">
	import { spring } from 'svelte/motion';

	let count = 0;

	const displayed_count = spring();
	$: displayed_count.set(count);
	$: offset = modulo($displayed_count, 1);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
</script>

<div class="gym">
	<div class="gym-leader-container">
		<img class="gym-leader-portrait" />
	</div>
	<div class="gym-party-container">
		<div class="gym-party-card"></div>
	</div>
	<div class="gym-start-container">
		<div class="gym-start-cost"></div>
		<button class="gym-start-button"></button>
	</div>

	<div class="gym-battle-container">
		<div class="gym-battle-start-text"></div>
		<div class="gym-battle-ko-text"></div>
		<div class="gym-battle-win-text"></div>
		<div class="gym-battle-loss-text"></div>

		<div class="gym-battle-party-container"></div>

		<div class="gym-battle-active-container">
			
		</div>

		<div class="gym-battle-party-container"></div>

	</div>
</div>

<style>
	
</style>
