<script lang="ts">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import { CardType } from '../../types';
    import { cardTypeToKey, cardTypeToString, packCard } from '../../cards';

    import {
        players,
        playerHands,
        playerCardCounts,
        innocents,
        set,
        preferences,
        playerPov,
    } from '../../stores';

    export interface Props {
        type: CardType;
    }

    let { type }: Props = $props();

    let sortedMaybeGroups = $derived(
        $playerHands
            // Get maybeGroups
            .map(hand => hand.maybeGroups)
            // Sort by key
            .map(group => [...group.entries()].sort(([a], [b]) => a - b)),
    );

    let hideFirst = $derived(
        $preferences.hideFirstColumn && $preferences.firstIsSelf && $playerPov === 0,
    );
</script>

<div style="display: table-row;">
    <DataTable table$aria-label="{cardTypeToString(type)} clue list" style="display: table-cell;">
        <Head>
            <Row style="height: 2.5em;">
                <Cell>{cardTypeToString(type)}</Cell>
                {#each hideFirst ? $players.slice(1) : $players as player, _i}
                    <!-- `i` would be off by one if we're ignoring the first player -->
                    {@const i = hideFirst ? _i + 1 : _i}
                    <Cell style="text-align: center;">
                        <!-- Name -->
                        {player}
                        {#if type === CardType.Suspect}
                            <br />
                            <!-- # of known cards -->
                            ({$playerHands[i].has.size}/{$playerCardCounts[i]})
                        {/if}
                    </Cell>
                {/each}
            </Row>
        </Head>
        <Body>
            {#each $set[1][cardTypeToKey(type)] as card, index}
                {@const packed = packCard(type, index)}
                <Row style="height: 2.5em;">
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
                    {#each hideFirst ? $playerHands.slice(1) : $playerHands as hand, _i}
                        <!-- `i` would be off by one if we're ignoring the first player -->
                        {@const i = hideFirst ? _i + 1 : _i}
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
</div>

<style scoped>
    .red {
        color: red;
    }

    .green {
        color: lightgreen;
    }
</style>
