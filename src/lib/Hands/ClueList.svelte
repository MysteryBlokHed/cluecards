<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import { CardType } from '../../types';
    import { cardTypeToKey, cardTypeToString, packCard } from '../../cards';

    import { players, playerHands, innocents, set } from '../../stores';

    export let type: CardType;
    let sortedMaybeGroups: Array<Array<[string, Set<number>]>>;
    $: sortedMaybeGroups = $playerHands
        // Get maybeGroups
        .map(hand => hand.maybeGroups)
        // Sort by key
        .map(group => Object.entries(group).sort(([a], [b]) => parseInt(a) - parseInt(b)));
    $: console.log(sortedMaybeGroups);
</script>

<DataTable table$aria-label="{cardTypeToString(type)} clue list">
    <Head>
        <Row>
            <Cell>{cardTypeToString(type)}</Cell>
            {#each $players as player}
                <Cell>{player}</Cell>
            {/each}
        </Row>
    </Head>
    <Body>
        {#each $set[1][cardTypeToKey(type)] as card, index}
            {@const packed = packCard(type, index)}
            <Row style="height: 3em;">
                <Cell>
                    <!-- Strikethrough if any player has this -->
                    {#if $innocents.has(packed)}
                        <s class="red">{card}</s>
                    {:else if $playerHands.every(hand => hand.missing.has(packed))}
                        <span class="green">{card}</span>
                    {:else}
                        <span>{card}</span>
                    {/if}
                </Cell>
                {#each $playerHands as hand, i}
                    <Cell style="text-align: center;">
                        {@const has = hand.has.has(packed)}
                        {@const missing = hand.missing.has(packed)}
                        {@const maybe = hand.maybe.has(packed)}
                        {#if has}
                            <span class="green">&check;</span>
                        {:else if missing}
                            <span class="red">&cross;</span>
                        {:else if maybe}
                            <span>?</span>
                        {/if}
                        <!-- Subscript for potentially-shown groups -->
                        {#if has || maybe}
                            {#each sortedMaybeGroups[i] as maybe, j}
                                {#if maybe[1].has(packed)}
                                    <sub style="font-size: 0.625rem;">{j + 1}</sub>
                                {/if}
                            {/each}
                        {/if}
                    </Cell>
                {/each}
            </Row>
        {/each}
    </Body>
</DataTable>

<style scoped>
    .red {
        color: red;
    }

    .green {
        color: lightgreen;
    }
</style>
