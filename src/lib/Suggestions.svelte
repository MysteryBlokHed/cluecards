<script lang="ts">
    import { cardTypeToKey, cardTypeToString, packCard } from '../cards';
    import { players, playerHands, set } from '../stores';
    import { CardType, RevealMethod, type Suggestion } from '../types';

    import SourceTooltip from './SourceTooltip.svelte';

    export interface Props {
        suggestions: Suggestion[];
        showExtraPossible?: boolean | undefined;
        title: string;
        open?: boolean | undefined;
        remove: (index: number) => void;
    }

    let { suggestions, showExtraPossible = false, title, open = false, remove }: Props = $props();

    let setContents = $derived($set[1]);

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

<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">{title}</h2>
        <div>
            <button
                class="btn btn-ghost text-primary"
                onclick={() => {
                    // Set to opposite first in case some panels are manually closed
                    open = false;
                    setTimeout(() => (open = true), 0);
                }}
                disabled={!suggestions.length}
            >
                Expand All
                <span class="material-icons">unfold_more</span>
            </button>
            <button
                class="btn btn-ghost text-primary"
                onclick={() => {
                    // Set to opposite first in case some panels are manually open
                    open = true;
                    setTimeout(() => (open = false), 0);
                }}
                disabled={!suggestions.length}
            >
                Collapse All
                <span class="material-icons">unfold_less</span>
            </button>
        </div>

        {#each [...suggestions].reverse() as { player, cards, responses }, i}
            <div class="collapse bg-base-200">
                <input type="checkbox" checked={open} />
                <div class="collapse-title">
                    <b>{$players[player]}</b>
                    suggested
                    <b>{setContents.suspects[cards[0]]}</b>
                    used
                    <b>{setContents.weapons[cards[1]]}</b>
                    in
                    <b>{setContents.rooms[cards[2]]}</b>
                </div>
                <div class="collapse-content">
                    {#if !responses.length}
                        No cards here...did something go wrong?
                    {/if}
                    {#each responses as response}
                        {@const style =
                            response.source === RevealMethod.InferSuggestion
                                ? 'color: lightseagreen;'
                                : ''}
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
                    <button class="btn" onclick={() => remove(suggestions.length - i - 1)}>
                        Delete
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>
