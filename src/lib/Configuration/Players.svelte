<script lang="ts">
    import { cardsPerHand, cardsPerHandFrac } from '../../cards';
    import {
        players,
        playerHands,
        playerCardCounts,
        set,
        suggestions,
        preferences,
    } from '../../stores';

    let uneditable = $derived(!!$suggestions[0]);

    let cardsFrac = $derived(cardsPerHandFrac($set[1], $players.length));
    let cards = $derived(Math.ceil(cardsFrac));
    let cardsInSet = $derived(cardsPerHand($set[1], 1));

    let countsValid = $derived($playerCardCounts.reduce((sum, curr) => sum + curr) === cardsInSet);

    function addPlayer() {
        $players = [...$players, ''];
        $playerHands = [
            ...$playerHands,
            { has: new Set(), missing: new Set(), maybe: new Set(), maybeGroups: new Map() },
        ];
        $playerCardCounts = defaultCardCounts();
    }

    function removePlayer(index: number) {
        if ($players.length === 1) return;
        $players.splice(index, 1);
        $playerHands.splice(index, 1);
        $players = $players;
        $playerHands = $playerHands;
        $playerCardCounts = defaultCardCounts();
    }

    function defaultCardCounts(): number[] {
        const playerCount = $players.length;
        const cardCounts = new Array(playerCount).fill(0);
        for (let i = 0; i < cardsInSet; i++) {
            cardCounts[i % playerCount]++;
        }
        return cardCounts;
    }
</script>

<div class="card-body">
    <h2 class="card-title">Players</h2>
    <span class="font-bold">
        Cards Per Hand:
        {#if cards === cardsFrac}
            <!-- Show exact -->
            {cards}
        {:else}
            <!-- Show range -->
            {Math.floor(cardsFrac)}&ndash;{Math.ceil(cardsFrac)}
            <!-- Less-rounded number -->
            (Avg. {cardsFrac.toFixed(2)})
        {/if}
    </span>

    <div>
        {#each $players, i}
            <div class="align-center">
                <div class="flex items-center justify-center gap-2">
                    <label class="form-control">
                        <div class="label p-0">
                            <span class="label-text">
                                {$preferences.firstIsSelf && i === 0 ? 'Your Name' : 'Player Name'}
                            </span>
                        </div>
                        <input
                            type="text"
                            class="input input-bordered"
                            placeholder={$preferences.firstIsSelf && i === 0
                                ? 'Your Name'
                                : 'Player Name'}
                            bind:value={$players[i]}
                            aria-invalid={!countsValid}
                        />
                    </label>

                    <label class="form-control">
                        <div class="label p-0">
                            <span class="label-text">Hand Size</span>
                        </div>
                        <input
                            type="number"
                            class="appearance-textfield input input-bordered w-16 {!countsValid
                                ? 'border-red-600 text-red-600'
                                : ''}"
                            bind:value={$playerCardCounts[i]}
                        />
                    </label>

                    <button
                        class="btn btn-circle relative top-2"
                        disabled={uneditable || $players.length === 1}
                        onclick={() => removePlayer(i)}
                    >
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        {/each}

        <button class="btn btn-ghost text-primary" disabled={uneditable} onclick={addPlayer}>
            Add
            <span class="material-icons">add</span>
        </button>
    </div>
</div>
