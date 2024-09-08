<script lang="ts">
    import Accordion from '@smui-extra/accordion';

    import AddCards from './lib/AddCards.svelte';
    import AddSuggestion from './lib/AddSuggestion.svelte';
    import Hands from './lib/Hands';
    import Players from './lib/Players.svelte';
    import RestartGame from './lib/RestartGame.svelte';
    import SetSelector from './lib/SetSelector.svelte';
    import Suggestions from './lib/Suggestions.svelte';
    import Preferences from './lib/Preferences.svelte';

    import {
        startingKnowns,
        set,
        suggestions,
        players,
        playerHands,
        playerCardCounts,
        preferences,
        innocents,
    } from './stores';
    import { infer, updateSuggestions } from './inference';
    import type { Suggestion } from './types';

    let amendedSuggestions: Suggestion[] = structuredClone($suggestions);

    $: {
        // Run inferences
        const [newHands, newInnocents] = infer(
            $suggestions,
            $startingKnowns,
            $players.length,
            $playerCardCounts,
            $set[1],
            $preferences.firstIsSelf,
        );

        $playerHands = newHands;
        $innocents = newInnocents;

        // Update suggestion details
        amendedSuggestions = updateSuggestions($suggestions, newHands);
    }

    function removeSuggestion(index: number) {
        $suggestions.splice(index, 1);
        $suggestions = $suggestions;
    }
</script>

<main class="flex-col">
    <h1>Cluecards</h1>
    <Accordion style="width: 505px;">
        <SetSelector />
        <Players />
        <AddCards />
        <Preferences />
        <RestartGame />
    </Accordion>
    <div class="flex">
        <div style="margin-right: 2rem;">
            <AddSuggestion />
            <br />
            <Suggestions
                suggestions={amendedSuggestions}
                title="Game Log"
                remove={removeSuggestion}
                showExtraPossible
                open
            />
            <br />

            <Suggestions
                suggestions={$suggestions}
                title="Game Log (Unmodified)"
                remove={removeSuggestion}
            />
        </div>
        <div class="flex-col">
            <Hands {amendedSuggestions} />
        </div>
    </div>
</main>
