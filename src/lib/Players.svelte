<script lang="ts">
    import Button, { Icon, Label } from '@smui/button';
    import IconButton from '@smui/icon-button';
    import Textfield from '@smui/textfield';

    import { cardsPerHand, cardsPerHandFrac } from '../cards';
    import {
        players,
        playerHands,
        playerCardCounts,
        set,
        suggestions,
        preferences,
    } from '../stores';

    let uneditable = $derived(!!$suggestions[0]);

    let cardsFrac = $derived(cardsPerHandFrac($set[1], $players.length));
    let cards = $derived(Math.ceil(cardsFrac));
    let cardsInSet = $derived(cardsPerHand($set[1], 1));

    let countsValid = $derived($playerCardCounts.reduce((sum, curr) => sum + curr) === cardsInSet);

    function addPlayer() {
        $players = [...$players, ''];
        $playerHands = [
            ...$playerHands,
            { has: new Set(), missing: new Set(), maybe: new Set(), maybeGroups: {} },
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

<div>
    <h2>Players</h2>
    <span style="font-weight: bold;">
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

    {#each $players, i}
        <div>
            <Textfield
                bind:value={$players[i]}
                label={$preferences.firstIsSelf && i === 0 ? 'Your Name' : 'Player Name'}
            />
            <Textfield
                type="number"
                bind:value={$playerCardCounts[i]}
                label="Hand Size"
                style="width: 4rem;"
                invalid={!countsValid}
            />
            <IconButton
                class="material-icons"
                disabled={uneditable || $players.length === 1}
                onclick={() => removePlayer(i)}>delete</IconButton
            >
        </div>
    {/each}

    <Button disabled={uneditable} onclick={addPlayer}>
        <Label>Add</Label>
        <Icon class="material-icons">add</Icon>
    </Button>
</div>
