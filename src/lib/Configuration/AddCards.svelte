<script lang="ts">
    import { cardTypeToKey, cardTypeToString } from '../../cards';
    import { players, set, startingKnowns } from '../../stores';
    import { CardType, RevealMethod } from '../../types';

    let player: number = $state(0);
    let cards: Array<[type?: CardType, card?: number]> = $state([]);

    function saveCards() {
        for (const card of cards) {
            $startingKnowns.push({
                type: 'innocent',
                cardType: card[0]!,
                card: card[1]!,
                player: player,
                source: RevealMethod.Self,
            });
        }

        player = 0;
        cards = [];

        $startingKnowns = $startingKnowns;
    }
</script>

<div class="card-body">
    <h2 class="card-title">Add Cards</h2>
    <span>Add cards to your hand at the start of the game.</span>
    <br />
    <div>
        <div class="form-control">
            <label class="label justify-center gap-1">
                <span>Player:</span>
                <select class="select select-bordered" bind:value={player}>
                    <!-- Pseudo-placeholder -->
                    <option value={undefined} disabled hidden selected>Player</option>
                    {#each $players as player, i}
                        <option value={i}>{player}</option>
                    {/each}
                </select>
            </label>
        </div>
        <div class="mb-2">
            {#each cards as card, i}
                <!-- Choose card type -->
                <select
                    class="select select-bordered"
                    bind:value={card[0]}
                    onchange={() => (card[1] = undefined)}
                >
                    <!-- Pseudo-placeholder -->
                    <option value={undefined} disabled hidden selected>Choose Card Type</option>
                    <option value={CardType.Suspect}>Suspect</option>
                    <option value={CardType.Weapon}>Weapon</option>
                    <option value={CardType.Room}>Room</option>
                </select>
                {#if card[0] != null}
                    <!-- Choose actual card -->
                    <select class="select select-bordered" bind:value={card[1]}>
                        <!-- Pseudo-placeholder -->
                        <option value={undefined} disabled hidden selected>
                            Choose {cardTypeToString(card[0])}
                        </option>
                        {#each $set[1][cardTypeToKey(card[0])] as cardName, j}
                            <option value={j}>{cardName}</option>
                        {/each}
                    </select>
                {/if}
                <button
                    class="btn btn-circle"
                    onclick={() => {
                        cards.splice(i, 1);
                        cards = cards;
                    }}
                >
                    <span class="material-icons">delete</span>
                </button>
                <br />
            {/each}
        </div>

        <button class="btn btn-secondary" onclick={() => cards.push([undefined, undefined])}>
            Add Card
            <span class="material-icons">add</span>
        </button>

        <button
            class="btn btn-primary"
            disabled={!cards.length || cards.some(card => card[0] == null || card[1] == null)}
            onclick={saveCards}
        >
            Save
            <span class="material-icons">save</span>
        </button>
    </div>
</div>
