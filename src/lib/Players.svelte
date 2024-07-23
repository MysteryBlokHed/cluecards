<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Icon, Label } from '@smui/button';
    import IconButton from '@smui/icon-button';
    import Textfield from '@smui/textfield';

    import { cardsPerHandFrac } from '../cards';
    import { players, playerHands, set } from '../stores';

    let cards: number;
    let cardsFrac: number;

    $: cardsFrac = cardsPerHandFrac($set[1], $players.length);
    $: cards = Math.ceil(cardsFrac);
</script>

<Panel>
    <Header>Players</Header>
    <Content>
        <span style="font-weight: bold;">
            Max Cards Per Hand:
            <!-- Rounded -->
            {cards}
            <!-- Unrounded -->
            {#if cards !== cardsFrac}
                ({cardsFrac})
            {/if}
        </span>

        {#each $players as player, i}
            <div>
                <Textfield bind:value={player} label={i === 0 ? 'Your Name' : 'Player Name'} />
                <IconButton
                    class="material-icons"
                    disabled={$players.length === 1}
                    on:click={() => {
                        if ($players.length === 1) return;
                        $players.splice(i, 1);
                        $playerHands.splice(i, 1);
                        $players = $players;
                        $playerHands = $playerHands;
                    }}>delete</IconButton
                >
            </div>
        {/each}

        <Button
            on:click={() => {
                $players = [...$players, ''];
                $playerHands = [
                    ...$playerHands,
                    { has: new Set(), missing: new Set(), maybe: new Set(), maybeGroups: {} },
                ];
            }}
        >
            <Label>Add</Label>
            <Icon class="material-icons">add</Icon>
        </Button>
    </Content>
</Panel>
