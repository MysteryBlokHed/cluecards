<script lang="ts">
    import Button, { Icon } from '@smui/button';
    import Paper from '@smui/paper';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';

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
    import { infer, stripSuggestions, updateSuggestions } from './inference';
    import type { Suggestion } from './types';
    import { untrack } from 'svelte';

    let amendedSuggestions: Suggestion[] = $state(structuredClone($suggestions));

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
    <h1>
        Cluecards
        <Button
            variant="raised"
            color="secondary"
            href="https://github.com/MysteryBlokHed/cluecards"
            target="_blank"
        >
            <Label>Source</Label>
            <Icon class="material-icons">open_in_new</Icon>
        </Button>
    </h1>
    <div class="grid">
        <div>
            <TabBar
                tabs={['Set Selector', 'Players', 'Add Cards', 'Preferences', 'Restart']}
                bind:active={activeTab}
            >
                {#snippet tab(tab)}
                    <Tab {tab}><Label>{tab}</Label></Tab>
                {/snippet}
            </TabBar>

            <Paper>
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
                {/if}</Paper
            >
        </div>
        <div>
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
