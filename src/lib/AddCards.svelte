<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Label, Icon } from '@smui/button';
    import IconButton from '@smui/icon-button';
    import Select, { Option } from '@smui/select';

    import { players, set, startingKnowns } from '../stores';
    import { CardType, RevealMethod } from '../types';
    import { cardTypeToKey, cardTypeToString } from '../cards';
    import { key } from '../ui';

    let player: number = 0;
    let cards: Array<[type?: CardType, card?: number]> = [];

    $: console.log(cards);

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

<Panel>
    <Header>Add Cards</Header>
    <Content>
        <span>Add cards to your hand at the start of the game.</span>
        <br />
        <Select {key} bind:value={player} label="Player">
            {#each $players as player, i}
                <Option value={i}>{player}</Option>
            {/each}
        </Select>
        <br />
        {#each cards as card, i}
            <!-- Choose card type -->
            <Select {key} bind:value={card[0]} label="Card Type">
                <Option value={CardType.Suspect}>Suspect</Option>
                <Option value={CardType.Weapon}>Weapon</Option>
                <Option value={CardType.Room}>Room</Option>
            </Select>
            {#if card[0] != null}
                <!-- Choose actual card -->
                <Select {key} bind:value={card[1]} label={cardTypeToString(card[0])}>
                    {#each $set[1][cardTypeToKey(card[0])] as cardName, j}
                        <Option value={j}>{cardName}</Option>
                    {/each}
                </Select>
            {/if}
            <IconButton
                on:click={() => {
                    cards.splice(i, 1);
                    cards = cards;
                }}
                class="material-icons">delete</IconButton
            >
            <br />
        {/each}

        <Button on:click={() => (cards = [...cards, [undefined, undefined]])}>
            <Label>Add Card</Label>
            <Icon class="material-icons">add</Icon>
        </Button>

        <Button
            variant="raised"
            disabled={!cards.length || cards.some(card => card[0] == null || card[1] == null)}
            on:click={saveCards}
        >
            <Label>Save</Label>
            <Icon class="material-icons">save</Icon>
        </Button>
    </Content>
</Panel>
