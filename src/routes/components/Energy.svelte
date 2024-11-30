<script lang="ts">
	import { PokemonTCG } from 'pokemon-tcg-sdk-typescript';
    import darknessEnergyUrl from '$lib/energies/30px-Darkness-attack.png';
    import fairyEnergyUrl from '$lib/energies/30px-Fairy-attack.png';
    import fightingEnergyUrl from '$lib/energies/30px-Fighting-attack.png';
    import fireEnergyUrl from '$lib/energies/30px-Fire-attack.png';
    import grassEnergyUrl from '$lib/energies/30px-Grass-attack.png';
    import lightningEnergyUrl from '$lib/energies/30px-Lightning-attack.png';
    import metalEnergyUrl from '$lib/energies/30px-Metal-attack.png';
    import psychicEnergyUrl from '$lib/energies/30px-Psychic-attack.png';
    import waterEnergyUrl from '$lib/energies/30px-Water-attack.png';

    export let energyType: PokemonTCG.Type = PokemonTCG.Type.Grass;

    let energyUrl = grassEnergyUrl;
    if (energyType == PokemonTCG.Type.Darkness) {
        energyUrl = darknessEnergyUrl;
    } else if (energyType == PokemonTCG.Type.Fairy) {
        energyUrl = fairyEnergyUrl;
    } else if (energyType == PokemonTCG.Type.Fighting) {
        energyUrl = fightingEnergyUrl;
    } else if (energyType == PokemonTCG.Type.Fire) {
        energyUrl = fireEnergyUrl;
    } else if (energyType == PokemonTCG.Type.Grass) {
        energyUrl = grassEnergyUrl;
    } else if (energyType == PokemonTCG.Type.Lightening) {
        energyUrl = lightningEnergyUrl;
    } else if (energyType == PokemonTCG.Type.Metal) {
        energyUrl = metalEnergyUrl;
    } else if (energyType == PokemonTCG.Type.Psychic) {
        energyUrl = psychicEnergyUrl;
    } else if (energyType == PokemonTCG.Type.Water) {
        energyUrl = waterEnergyUrl;
    } else {
        console.warn(`Component Energy: Invalid enery type ${energyType}`)
    }

</script>

<img class="psa--energy" alt="energy" src="{energyUrl}"/>
