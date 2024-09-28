<script lang="ts">
    import Paper from '@smui/paper';
    import Select, { Option } from '@smui/select';
    import Tooltip, { Wrapper } from '@smui/tooltip';

    import { cardTypeToKey, unpackCard } from '../../cards';
    import { players, playerHands, preferences, set, playerPov } from '../../stores';
    import { CardType } from '../../types';

    import ClueList from './ClueList.svelte';

    interface DisplayedHand {
        has: string[];
        missing: string[];
        maybe: string[];
    }

    let displayable: Array<[DisplayedHand, DisplayedHand, DisplayedHand]> = [];

    $: {
        for (const [player, hand] of $playerHands.entries()) {
            displayable.push([
                { has: [], missing: [], maybe: [] },
                { has: [], missing: [], maybe: [] },
                { has: [], missing: [], maybe: [] },
            ]);

            for (const packed of hand.has) {
                // Unpack card
                const [type, card] = unpackCard(packed) as [0 | 1 | 2, number];
                // Get name of card
                const cardString = $set[1][cardTypeToKey(type)][card];
                // Add to display list
                displayable[player][type].has.push(cardString);
            }

            for (const packed of hand.missing) {
                // Unpack card
                const [type, card] = unpackCard(packed) as [0 | 1 | 2, number];
                // Get name of card
                const cardString = $set[1][cardTypeToKey(type)][card];
                // Add to display list
                displayable[player][type].missing.push(cardString);
            }

            for (const packed of hand.maybe) {
                // Unpack card
                const [type, card] = unpackCard(packed) as [0 | 1 | 2, number];
                // Get name of card
                const cardString = $set[1][cardTypeToKey(type)][card];
                // Add to display list
                displayable[player][type].maybe.push(cardString);
            }
        }
    }
</script>

<Paper style="display: table;">
    <h2>Clues</h2>

    {#if $preferences.firstIsSelf}
        <div>
            <Wrapper>
                <Select bind:value={$playerPov} label="Preview clue sheet of...">
                    {#each $players as player, i}
                        <Option value={i}>{player}</Option>
                    {/each}
                </Select>
                <Tooltip>
                    Applies the same inference logic from the perspective of another player to see
                    what they might know.
                </Tooltip>
            </Wrapper>
        </div>
    {/if}

    <div style="display: flex; align-items: center; justify-content: center;"></div>
    <ClueList type={CardType.Suspect} />
    <ClueList type={CardType.Weapon} />
    <ClueList type={CardType.Room} />
</Paper>
