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
        playerPov,
    } from './stores';
    import { infer, stripSuggestions, updateSuggestions } from './inference';
    import type { Suggestion } from './types';

    let amendedSuggestions: Suggestion[] = structuredClone($suggestions);

    $: {
        /** Whether we are looking at another player's view. */
        const fromOtherPov = $preferences.firstIsSelf && $playerPov !== 0;

        /** Suggestions, stripped of extra info if required by the POV. */
        const updatedSuggestions = fromOtherPov
            ? stripSuggestions($suggestions, $playerPov)
            : $suggestions;

        /**
         * A filtered version of startingKnowns if we are looking at another player's POV.
         * Otherwise, just the regular list.
         */
        const updatedStartingKnowns = fromOtherPov
            ? $startingKnowns.filter(
                  known => known.type === 'innocent' && known.player === $playerPov,
              )
            : $startingKnowns;

        // Run inferences
        const [newHands, newInnocents] = infer(
            updatedSuggestions,
            updatedStartingKnowns,
            $players.length,
            $playerCardCounts,
            $set[1],
            fromOtherPov ? false : $preferences.firstIsSelf,
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
