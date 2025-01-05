<script lang="ts">
    import { unpackCard, packSet, cardTypeToKey } from '../../cards';
    import { findSuggestionForces } from '../../inference';
    import { players, playerHands, set } from '../../stores';

    let forceDialog: HTMLDialogElement;

    let potentialForceTargets: number[] = $state([]);
    let forceTarget: number | null = $state(null);
    let potentialForceSuggestions: Record<number, Array<[string, string[]]>> = $state({});

    function forceReveal() {
        const packedSet = packSet($set[1]);
        potentialForceTargets = [];
        potentialForceSuggestions = {};
        forceTarget = null;

        for (const packed of packedSet) {
            if ($playerHands.every(hand => !hand.has.has(packed))) {
                // Get potential forces
                const forceSuggestionsRaw = findSuggestionForces(packed, $playerHands, $set[1]);
                const forceSuggestions: Array<[string, string[]]> = [];

                for (const force of forceSuggestionsRaw) {
                    // Cards to suggest, ordered by type
                    const cards = [packed, ...force.map(card => card.packed)].sort(
                        (a, b) => unpackCard(a)[0] - unpackCard(b)[0],
                    );

                    // Sources for cards used in force
                    const sourcesRaw = force.map(card => card.source);
                    const sourcesDisp: Record<string, number> = {};

                    for (const source of sourcesRaw) {
                        let key: string;
                        switch (source) {
                            case -2:
                                key = 'All Missing';
                                break;
                            case -1:
                                key = 'Murder Card';
                                break;
                            case 0:
                                key = 'Own Card';
                                break;
                            default:
                                key = $players[source];
                                break;
                        }

                        sourcesDisp[key] ??= 0;
                        sourcesDisp[key]++;
                    }

                    forceSuggestions.push([
                        // Cards to suggest
                        cards
                            .map(packed => {
                                const [type, card] = unpackCard(packed);
                                return $set[1][cardTypeToKey(type)][card];
                            })
                            .join(', '),
                        // Sources for cards used
                        Object.entries(sourcesDisp).map(([source, count]) => `${source}: ${count}`),
                    ]);
                }

                if (forceSuggestions.length) {
                    potentialForceTargets.push(packed);
                    potentialForceSuggestions[packed] = forceSuggestions;
                }
            }
        }

        forceDialog.showModal();
    }
</script>

<div>
    <button class="btn btn-secondary w-full" onclick={forceReveal}>
        Force Reveal
        <span class="material-icons">build</span>
    </button>
    <br />
    See if there are any cards that can be forced to reveal with a suggestion.
</div>

<dialog class="modal" bind:this={forceDialog}>
    <div class="modal-box" id="force-content">
        <h2 class="text-xl" id="force-title">Force Reveal</h2>

        <select
            class="select select-bordered"
            bind:value={forceTarget}
            disabled={!potentialForceTargets.length}
        >
            <!-- Pseudo-placeholder -->
            <option value={null} disabled hidden selected>Card to force</option>
            {#each potentialForceTargets as potential}
                {@const [type, card] = unpackCard(potential)}
                <option value={potential}>{$set[1][cardTypeToKey(type)][card]}</option>
            {/each}
        </select>
        <br />
        {#if forceTarget != null && potentialForceSuggestions[forceTarget].length}
            <table class="table">
                <thead>
                    <tr>
                        <th>Cards</th>
                        <th>Sources</th>
                    </tr>
                </thead>
                <tbody>
                    {#each potentialForceSuggestions[forceTarget] as [cards, sources]}
                        <tr>
                            <td>{cards}</td>
                            <td>
                                {#each sources as source}
                                    <span>{source}</span>
                                    <br />
                                {/each}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <br />
        {:else if forceTarget != null}
            {@const [type, card] = unpackCard(forceTarget)}
            <h2>Cannot force {$set[1][cardTypeToKey(type)][card]}</h2>
        {:else if potentialForceTargets.length}
            <p>
                Select a card.
                <br />
                If a card is not listed, it cannot currently be forced.
            </p>
        {:else}
            <h3>No cards can currently be forced.</h3>
        {/if}

        <br />

        <p class="font-bold">
            Note: Forcing a reveal like this can also reveal information to other players if they
            know one or both of the cards besides the target card.
        </p>

        <div class="modal-action">
            <form method="dialog">
                <button class="btn">Close</button>
            </form>
        </div>
    </div>
</dialog>
