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
    import { infer } from './inference';
    import type { Known, Suggestion } from './types';

    let amendedSuggestions: Suggestion[] = structuredClone($suggestions);
    let knowns: Known[] = [];

    $: {
        // Run inferences
        const newCount = amendedSuggestions.length - $suggestions.length;
        if (newCount > 0)
            console.log('Note: Updated suggestions list is shorter. Data will be lost');

        const [inferKnowns, inferSuggestions, newHands, newInnocents] = infer(
            structuredClone($suggestions),
            $set[1],
            $players.length,
            $playerCardCounts,
            $preferences.firstIsSelf,
            $startingKnowns,
        );
        amendedSuggestions = inferSuggestions;
        $playerHands = newHands;
        $innocents = newInnocents;
        knowns = inferKnowns;
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
            <Hands {knowns} {amendedSuggestions} />
        </div>
    </div>
</main>
