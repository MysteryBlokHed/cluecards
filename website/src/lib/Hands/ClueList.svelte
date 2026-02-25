<script lang="ts">
    import { cardTypeToKey, cardTypeToString, packCard } from '../../cards';
    import { CardType } from '../../types';
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

    let sortedMaybeGroups = $derived($playerHands.map(hand => hand.maybeGroups));

    let hideFirst = $derived(
        $preferences.hideFirstColumn && $preferences.firstIsSelf && $playerPov === 0,
    );
</script>

<div class="table-row">
    <table class="table" aria-label="{cardTypeToString(type)} clue list">
        <thead>
            <tr>
                <th class="m-0">{cardTypeToString(type)}</th>
                {#each hideFirst ? $players.slice(1) : $players as player, _i}
                    <!-- `i` would be off by one if we're ignoring the first player -->
                    {@const i = hideFirst ? _i + 1 : _i}
                    <th class="text-center">
                        <!-- Name -->
                        {player}
                        {#if type === CardType.Suspect}
                            <br />
                            <!-- # of known cards -->
                            ({$playerHands[i].has.size}/{$playerCardCounts[i]})
                        {/if}
                    </th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each $set[1][cardTypeToKey(type)] as card, index}
                {@const packed = packCard(type, index)}
                <tr>
                    <td class="w-40">
                        <!-- Strikethrough if any player has this -->
                        {#if $innocents.has(packed)}
                            <s class="text-red-500">{card}</s>
                        {:else if $playerHands.every(hand => hand.missing.has(packed))}
                            <span class="text-green-400">{card}</span>
                        {:else}
                            <span>{card}</span>
                        {/if}
                    </td>
                    {#each hideFirst ? $playerHands.slice(1) : $playerHands as hand, _i}
                        <!-- `i` would be off by one if we're ignoring the first player -->
                        {@const i = hideFirst ? _i + 1 : _i}
                        {@const has = hand.has.has(packed)}
                        {@const missing = hand.missing.has(packed)}
                        {@const maybe = hand.maybe.has(packed)}
                        <td class="text-center">
                            {#if has}
                                <span class="text-green-400">&check;</span>
                            {:else if missing}
                                <span class="text-red-500">&cross;</span>
                            {:else if maybe}
                                <span>?</span>
                            {/if}
                            <!-- Subscript for potentially-shown groups -->
                            {#if has || maybe}
                                {#each sortedMaybeGroups[i] as maybe, j}
                                    {#if maybe.has(packed)}
                                        <sub class="text-[0.625rem]">{j + 1}</sub>
                                    {/if}
                                {/each}
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
