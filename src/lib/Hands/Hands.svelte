<script lang="ts">
    import Paper from '@smui/paper';

    import { playerHands, set } from '../../stores';
    import { cardTypeToKey, unpackCard } from '../../cards';
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

<Paper>
    <h2>Clues</h2>
    <ClueList type={CardType.Suspect} />
    <br />
    <ClueList type={CardType.Weapon} />
    <br />
    <ClueList type={CardType.Room} />
</Paper>
