<script lang="ts">
    import Paper from '@smui/paper';
    import type { Suggestion } from '../../types';

    import CalculateOdds from './CalculateOdds.svelte';
    import ForceReveal from './ForceReveal.svelte';

    export let amendedSuggestions: readonly Suggestion[];
</script>

<Paper style="height: min-content;">
    <h2>Game Tools</h2>
    <p>Leverage inferences to gain more information.</p>
    <hr />
    <ForceReveal />
    <hr />
    <CalculateOdds {amendedSuggestions} />
</Paper>
