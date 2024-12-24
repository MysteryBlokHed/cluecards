<script lang="ts">
    import './app.css';

    import AddCards from './lib/AddCards.svelte';
    import AddSuggestion from './lib/AddSuggestion.svelte';
    import GameTools from './lib/GameTools/';
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
    import { stripSuggestions, updateSuggestions } from './inference';
    import { infer } from '../inference/pkg/inference';

    import type { Suggestion } from './types';
    import { untrack } from 'svelte';

    let amendedSuggestions: Suggestion[] = $state(
        structuredClone($state.snapshot($suggestions) as Suggestion[]),
    );

    const tabs = ['Set Selector', 'Players', 'Add Cards', 'Preferences', 'Restart'] as const;
    let activeTab: string = $state('Set Selector');

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
        $suggestions,
            $startingKnowns,
            $players.length,
            $playerCardCounts,
            $set,
            $preferences,
            $playerPov;

        // Figuring out dependencies was too much of a disaster so let's just untrack the whole thing
        untrack(() => {
            // Run inferences
            const [newHands, newInnocents] = infer(
                $suggestions,
                $startingKnowns,
                $players.length,
                $playerCardCounts,
                $set[1],
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
                const [newHands, newInnocents] = infer(
                    updatedSuggestions,
                    updatedStartingKnowns,
                    $players.length,
                    $playerCardCounts,
                    $set[1],
                    false,
                );

                $playerHands = newHands;
                $innocents = newInnocents;
            }
        });
    });

    function removeSuggestion(index: number) {
        $suggestions.splice(index, 1);
        $suggestions = $suggestions;
    }

    function setTab(tab: string) {
        activeTab = tab;
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
            <div role="tablist" class="group tabs tabs-bordered">
                {#each tabs as tab}
                    <input
                        bind:group={activeTab}
                        type="radio"
                        role="tab"
                        class="tab pb-8 text-lg checked:[--fallback-bc:theme(colors.primary)]"
                        name="app_tabs"
                        value={tab}
                        aria-label={tab}
                    />
                {/each}
            </div>

            <div class="card rounded-t-none bg-base-100 shadow-xl">
                {#if activeTab === 'Set Selector'}
                    <SetSelector />
                {:else if activeTab === 'Players'}
                    <Players />
                {:else if activeTab === 'Add Cards'}
                    <AddCards />
                {:else if activeTab === 'Preferences'}
                    <Preferences />
                {:else if activeTab === 'Restart'}
                    <RestartGame {setTab} />
                {/if}
            </div>
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
