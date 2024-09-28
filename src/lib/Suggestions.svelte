<script lang="ts">
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Icon, Label } from '@smui/button';
    import Paper from '@smui/paper';

    import { players, playerHands, set } from '../stores';
    import { CardType, RevealMethod, type GameSet, type Suggestion } from '../types';
    import { cardTypeToKey, cardTypeToString, packCard } from '../cards';
    import SourceTooltip from './SourceTooltip.svelte';

    export let suggestions: Suggestion[];
    export let showExtraPossible = false;
    export let title: string;
    export let open = false;

    export let remove: (index: number) => void;

    let setContents: GameSet;
    $: setContents = $set[1];

    function getPossibleCards(cards: Suggestion['cards'], player: number): string[] {
        // Convert suggestion cards to [type, card] format
        const cardsConverted = cards.map(
            (card, type) => [type, card] as [type: CardType, card: number],
        );

        return (
            cardsConverted
                // Filter out cards that the responder is explicitly missing
                .filter(card => !$playerHands[player].missing.has(packCard(...card)))
                // Convert cards to human-readable strings (in the form "CardType Name")
                .map(([type, card]) => setContents[cardTypeToKey(type)][card])
        );
    }
</script>

<Paper>
    <h2 style="margin-bottom: 0;">{title}</h2>
    <Button
        on:click={() => {
            // Set to opposite first in case some panels are manually closed
            open = false;
            open = true;
        }}
        disabled={!suggestions.length}
    >
        <Label>Expand All</Label>
        <Icon class="material-icons">unfold_more</Icon>
    </Button>
    <Button
        on:click={() => {
            // Set to opposite first in case some panels are manually open
            open = true;
            open = false;
        }}
        disabled={!suggestions.length}
    >
        <Label>Collapse All</Label>
        <Icon class="material-icons">unfold_less</Icon>
    </Button>

    <Accordion multiple>
        {#each [...suggestions].reverse() as { player, cards, responses }, i}
            <Panel {open} class="suggestions__suggestion">
                <Header>
                    <b>{$players[player]}</b>
                    suggested
                    <b>{setContents.suspects[cards[0]]}</b>
                    used
                    <b>{setContents.weapons[cards[1]]}</b>
                    in
                    <b>{setContents.rooms[cards[2]]}</b>
                </Header>
                <Content>
                    {#if !responses.length}
                        No cards here...did something go wrong?
                    {/if}
                    {#each responses as response}
                        {@const style =
                            response.source === RevealMethod.InferSuggestion
                                ? 'color: lightseagreen;'
                                : ''}
                        <!--
                        FUN FACT! 
                        Without this <div> element, the <Tooltip> will occasionally
                        crap itself entirely and cause the entire page to crash.
                        That was a fun one to figure out!
                        -->
                        <div>
                            <b>{$players[response.player]}</b>
                            showed
                            {#if showExtraPossible && response.cardType === CardType.Unknown}
                                <!-- Show which cards it may have been -->
                                {@const possibleCards = getPossibleCards(cards, response.player)}
                                <!-- "or"-separated list, with card names bolded -->
                                {#each possibleCards as possibleCard, possibleIndex}
                                    <b>{possibleCard}</b>
                                    {#if possibleIndex != possibleCards.length - 1}
                                        {'or '}
                                    {/if}
                                {/each}
                                {#if possibleCards.length === 2}
                                    <SourceTooltip
                                        text="These cards were inferred. It is not known exactly which one was shown."
                                    />
                                {/if}
                            {:else if response.cardType < 0}
                                <b {style}>{cardTypeToString(response.cardType)}</b>
                            {/if}
                            <!-- Show card name if available -->
                            {#if response.cardType >= 0}
                                <b {style}>
                                    {setContents[cardTypeToKey(response.cardType)][response.card]}
                                </b>
                            {/if}
                            <!-- If the data was inferred, show a tooltip -->
                            {#if response.source === RevealMethod.InferSuggestion}
                                <SourceTooltip {style} text="This card was inferred." />
                            {:else if response.source === RevealMethod.Direct}
                                <SourceTooltip text="This card was directly shown." />
                            {:else if response.source === RevealMethod.Self}
                                <SourceTooltip text="This is your card." />
                            {/if}
                            <br />
                        </div>
                    {/each}
                    <Button on:click={() => remove(suggestions.length - i - 1)}>
                        <Label>Delete</Label>
                        <Icon class="material-icons">delete</Icon>
                    </Button>
                </Content>
            </Panel>
        {/each}
    </Accordion>
</Paper>
