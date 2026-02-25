<script lang="ts">
    import type { Suggestion } from '../../types';

    import CalculateOdds from './CalculateOdds.svelte';
    import ForceReveal from './ForceReveal.svelte';

    export interface Props {
        amendedSuggestions: readonly Suggestion[];
    }

    let { amendedSuggestions }: Props = $props();
</script>

<div class="card max-w-[650px] bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title justify-center text-2xl">Game Tools</h2>
        <p>Leverage inferences to gain more information.</p>
        <hr />
        <ForceReveal />
        <hr />
        <CalculateOdds {amendedSuggestions} />
    </div>
</div>
