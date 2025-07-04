<script lang="ts">
    import './app.css';

    import { untrack } from 'svelte';

    import {
        inference as inferencePromise,
        stripSuggestions,
        updateSuggestions,
    } from './inference';
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
    import type { Suggestion } from './types';

    import AddSuggestion from './lib/AddSuggestion.svelte';
    import Configuration from './lib/Configuration/';
    import GameTools from './lib/GameTools/';
    import Hands from './lib/Hands';
    import Suggestions from './lib/Suggestions.svelte';

    let inference = $state<Awaited<typeof inferencePromise> | null>(null);
    inferencePromise.then(resolved => (inference = resolved));

    let amendedSuggestions: Suggestion[] = $state(
        structuredClone($state.snapshot($suggestions) as Suggestion[]),
    );

    // Update viewport based on device size
    window.addEventListener(
        'load',
        () => {
            if (screen.width < 750) {
                const viewport = document.getElementById('viewport') as HTMLMetaElement;
                viewport.content = 'width=750';
            }
        },
        { once: true },
    );

    $effect(() => {
        // @ts-expect-error Just to manually set dependencies
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        inference,
            $suggestions,
            $startingKnowns,
            $players.length,
            $playerCardCounts,
            $set,
            $preferences,
            $playerPov;

        // Figuring out dependencies was too much of a disaster so let's just untrack the whole thing
        untrack(async () => {
            if (inference == null) {
                console.warn('[Main App]', 'Inference worker is not ready yet');
                return;
            }

            console.time('Running inference');

            if ($preferences.disableInference) {
                amendedSuggestions = $state.snapshot($suggestions) as Suggestion[];
                const [newHands, newInnocents] = await inference.infer(
                    [],
                    [],
                    $players.length,
                    $state.snapshot($playerCardCounts),
                    $state.snapshot($set[1]),
                    false,
                );
                $playerHands = newHands;
                $innocents = newInnocents;

                console.timeEnd('Running inference');
                return;
            }

            // Run inferences
            const [newHands, newInnocents] = await inference.infer(
                $state.snapshot($suggestions) as Suggestion[], // I have no idea why this assertion is needed
                $state.snapshot($startingKnowns),
                $players.length,
                $state.snapshot($playerCardCounts),
                $state.snapshot($set[1]),
                $preferences.firstIsSelf,
            );

            // Update suggestion details
            amendedSuggestions = updateSuggestions(
                $state.snapshot($suggestions) as Suggestion[],
                newHands,
            );

            $playerHands = newHands;
            $innocents = newInnocents;

            // If we are trying to see another player's POV
            if ($preferences.firstIsSelf && $playerPov !== 0) {
                const updatedSuggestions = stripSuggestions(
                    $state.snapshot(amendedSuggestions) as Suggestion[],
                    $playerPov,
                );

                const updatedStartingKnowns = $startingKnowns.filter(
                    known => known.type === 'innocent' && known.player === $playerPov,
                );

                // Re-run inferences
                const [newHands, newInnocents] = await inference.infer(
                    updatedSuggestions,
                    updatedStartingKnowns,
                    $players.length,
                    $state.snapshot($playerCardCounts),
                    $state.snapshot($set[1]),
                    false,
                );

                $playerHands = newHands;
                $innocents = newInnocents;
            }

            console.timeEnd('Running inference');
        });
    });

    function removeSuggestion(index: number) {
        $suggestions.splice(index, 1);
        $suggestions = $suggestions;
    }
</script>

<main>
    <h1 class="flex items-center justify-center gap-4 text-4xl">
        Cluecards
        <a href="https://github.com/MysteryBlokHed/cluecards" target="_blank">
            <button class="btn">
                Source
                <span class="material-icons">open_in_new</span>
            </button>
        </a>
    </h1>
    <div class="mt-4 grid">
        <div>
            <Configuration />
        </div>
        <div class="mt-8">
            <GameTools {amendedSuggestions} />
        </div>
        <div>
            <div>
                <AddSuggestion />
                <br />
                <Suggestions
                    suggestions={amendedSuggestions}
                    title="Game Log"
                    remove={removeSuggestion}
                    showExtraPossible
                    open
                />
            </div>
        </div>
        <div>
            <Hands />
        </div>
    </div>
</main>

<style scoped>
    .grid {
        display: grid;
        grid-template-columns: 4fr 3fr;
        gap: 1rem;
    }

    @media only screen and (max-width: 1130px) {
        .grid {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
</style>
