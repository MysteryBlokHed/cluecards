<script lang="ts">
    import { cardTypeToKey } from '../../cards';
    import { probabilities } from '../../../inference/pkg/inference';
    import { playerCardCounts, playerHands, preferences, set, startingKnowns } from '../../stores';
    import type { Suggestion } from '../../types';

    export interface Props {
        amendedSuggestions: readonly Suggestion[];
    }

    let { amendedSuggestions }: Props = $props();

    let oddsDialog: HTMLDialogElement;
    let showPercentages = $state(true);
    let overrideBody = $state('');
    let oddsTable: Record<string, number> = $state({});
    let totalOccurences = $state(0);

    function calculateOdds() {
        if ($preferences.disableInference) {
            overrideBody = 'Inference is disabled; probabilities calculations cannot be run.';
            oddsDialog.showModal();
            return;
        }

        oddsTable = {};
        totalOccurences = 0;

        let probs: ReturnType<typeof probabilities>;

        console.time('Calculating and displaying probabilities');

        try {
            probs = probabilities(
                $state.snapshot(amendedSuggestions) as Suggestion[],
                $set[1],
                $state.snapshot($playerHands),
                $playerCardCounts,
                $preferences.firstIsSelf,
                $startingKnowns,
            );
            overrideBody = '';
        } catch (e) {
            console.timeEnd('Calculating and displaying probabilities');
            console.error(e);
            overrideBody =
                'Probability calculations took too long. Try narrowing down your clues first.';
            oddsDialog.showModal();
            return;
        }

        for (const [triplet, count] of Object.entries(probs)) {
            totalOccurences += count;

            const cards = triplet
                .split('|')
                .map(num => parseInt(num))
                .map((card, type) => $set[1][cardTypeToKey(type)][card]);
            oddsTable[cards.join(', ')] = count;
        }
        console.table($state.snapshot(oddsTable));

        console.timeEnd('Calculating and displaying probabilities');

        oddsDialog.showModal();
    }
</script>

<div>
    <button class="btn btn-secondary w-full" onclick={calculateOdds}>
        Calculate Odds
        <span class="material-icons">casino</span>
    </button>
    <br />
    Try to find the most likely murder cards. This option is experimental and likely innacurate. Probabilities
    are not foolproof. Only use this as a last-resort if you think a player is going to make a correct
    accusation before you.
</div>

<dialog
    class="modal"
    bind:this={oddsDialog}
    aria-labelledby="odds-title"
    aria-describedby="odds-content"
>
    <div class="modal-box" id="odds-content">
        <h2 class="text-xl" id="odds-title">Odds</h2>
        {#if overrideBody}
            {overrideBody}
        {:else}
            <div class="form-control">
                <label class="label justify-center gap-1">
                    <span>Show Percentages</span>
                    <input type="checkbox" class="toggle" bind:checked={showPercentages} />
                </label>
            </div>

            <table class="table" aria-label="Table of card odds">
                <thead>
                    <tr>
                        <th>Suspect, Weapon, Room</th>
                        <th>
                            {#if showPercentages}
                                Odds
                            {:else}
                                Occurrencecs
                            {/if}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Iterate over entries in table, sorted by probability -->
                    {#each Object.entries(oddsTable).sort(([, a], [, b]) => b - a) as [triplet, count]}
                        <tr>
                            <td>{triplet}</td>
                            <td>
                                {#if showPercentages}
                                    {((count / totalOccurences) * 100).toFixed(2)}%
                                {:else}
                                    {count}
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}

        <div class="modal-action">
            <form method="dialog">
                <button class="btn">Close</button>
            </form>
        </div>
    </div>
</dialog>
