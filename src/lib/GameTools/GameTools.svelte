<script lang="ts">
    import Paper from '@smui/paper';
    import type { Suggestion } from '../../types';

    import CalculateOdds from './CalculateOdds.svelte';
    import ForceReveal from './ForceReveal.svelte';

    export interface Props {
        amendedSuggestions: readonly Suggestion[];
    }

    let { amendedSuggestions }: Props = $props();
</script>

<Paper class="gametools__paper" style="height: min-content; max-width: 650px;">
    <h2>Game Tools</h2>
    <p>Leverage inferences to gain more information.</p>
    <hr />
    <ForceReveal />
    <hr />
    <CalculateOdds {amendedSuggestions} />
</Paper>
