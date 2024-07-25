<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Icon, Label } from '@smui/button';
    import IconButton from '@smui/icon-button';
    import Textfield from '@smui/textfield';

    import { cardsPerHand, cardsPerHandFrac } from '../cards';
    import { players, playerHands, playerCardCounts, set, suggestions } from '../stores';

    let uneditable: boolean;
    $: uneditable = !!$suggestions.length;

    let cards: number;
    let cardsFrac: number;
    let cardsInSet: number;

    $: cardsFrac = cardsPerHandFrac($set[1], $players.length);
    $: cards = Math.ceil(cardsFrac);
    $: cardsInSet = cardsPerHand($set[1], 1);

    let countsValid: boolean;
    $: countsValid = $playerCardCounts.reduce((sum, curr) => sum + curr) === cardsInSet;

    function defaultCardCounts(): number[] {
        const playerCount = $players.length;
        const cardCounts = new Array(playerCount).fill(0);
        for (let i = 0; i < cardsInSet; i++) {
            cardCounts[i % playerCount]++;
        }
        return cardCounts;
    }
</script>

<Panel>
    <Header>Players</Header>
    <Content>
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

        {#each $players as player, i}
            <div>
                <Textfield bind:value={player} label={i === 0 ? 'Your Name' : 'Player Name'} />
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
                    on:click={() => {
                        if ($players.length === 1) return;
                        $players.splice(i, 1);
                        $playerHands.splice(i, 1);
                        $players = $players;
                        $playerHands = $playerHands;
                        $playerCardCounts = defaultCardCounts();
                    }}>delete</IconButton
                >
            </div>
        {/each}

        <Button
            disabled={uneditable}
            on:click={() => {
                $players = [...$players, ''];
                $playerHands = [
                    ...$playerHands,
                    { has: new Set(), missing: new Set(), maybe: new Set(), maybeGroups: {} },
                ];
                $playerCardCounts = defaultCardCounts();
            }}
        >
            <Label>Add</Label>
            <Icon class="material-icons">add</Icon>
        </Button>
    </Content>
</Panel>
