<script lang="ts">
    import Button, { Icon, Label } from '@smui/button';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import FormField from '@smui/form-field';
    import Paper from '@smui/paper';
    import Switch from '@smui/switch';
    import Tooltip, { Content as TooltipContent, Wrapper } from '@smui/tooltip';

    import { cardTypeToKey, unpackCard } from '../../cards';
    import { probabilities } from '../../inference';
    import { playerCardCounts, playerHands, set, startingKnowns } from '../../stores';
    import { CardType, type Known, type Suggestion } from '../../types';

    import ClueList from './ClueList.svelte';

    export let knowns: readonly Known[];
    export let amendedSuggestions: readonly Suggestion[];

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

    let oddsOpen = false;
    let showPercentages = true;
    let overrideBody = '';
    let oddsTable: Record<string, number> = {};
    let totalOccurences = 0;

    function calculateOdds() {
        oddsTable = {};
        totalOccurences = 0;

        let probs: ReturnType<typeof probabilities>;

        console.time('Calculating and displaying probabilities');

        try {
            probs = probabilities(amendedSuggestions, $set[1], $playerHands, $playerCardCounts, [
                ...$startingKnowns,
                ...knowns,
            ]);
            overrideBody = '';
        } catch (e) {
            console.timeEnd('Calculating and displaying probabilities');
            console.error(e);
            overrideBody =
                'Probability calculations took too long. Try narrowing down your clues first.';
            oddsOpen = true;
            return;
        }

        for (const [triplet, count] of Object.entries(probs)) {
            totalOccurences += count;

            const cards = triplet
                .split('|')
                .map(num => parseInt(num))
                .map((card, type) => $set[1][cardTypeToKey(type)][card]);
            oddsTable[cards.join(', ')] = count;
        }
        console.table(oddsTable);

        console.timeEnd('Calculating and displaying probabilities');

        oddsOpen = true;
    }
</script>

<Paper style="display: table;">
    <h2>Clues</h2>
    <div style="display: flex; align-items: center; justify-content: center;">
        <Button variant="raised" color="secondary" on:click={calculateOdds}>
            <Label>Calculate Odds</Label>
            <Icon class="material-icons">casino</Icon>
        </Button>
        <!-- Info button for odds -->
        <Wrapper rich>
            <span class="material-icons" tabindex="0" role="button">help</span>
            <Tooltip persistent>
                <TooltipContent style="width: 200px;">
                    Try to find the most likely murder cards. This option is experimental and likely
                    innacurate. Probabilities are not foolproof. Only use this as a last-resort if
                    you think a player is going to make a correct accusation before you.
                </TooltipContent>
            </Tooltip>
        </Wrapper>
    </div>
    <ClueList type={CardType.Suspect} />
    <ClueList type={CardType.Weapon} />
    <ClueList type={CardType.Room} />
</Paper>

<Dialog bind:open={oddsOpen} aria-labelledby="odds-title" aria-describedby="odds-content">
    <Title id="odds-title">Odds</Title>
    <Content id="odds-content" style="display: flex; flex-direction: column;">
        {#if overrideBody}
            {overrideBody}
        {:else}
            <FormField>
                <Switch bind:checked={showPercentages} />
                <span slot="label">Show Percentages</span>
            </FormField>
            <DataTable table$aria-label="Table of card odds">
                <Head>
                    <Row>
                        <Cell>Suspect, Weapon, Room</Cell>
                        <Cell>
                            {#if showPercentages}
                                Odds
                            {:else}
                                Occurrencecs
                            {/if}
                        </Cell>
                    </Row>
                </Head>
                <Body>
                    <!-- Iterate over entries in table, sorted by probability -->
                    {#each Object.entries(oddsTable).sort(([, a], [, b]) => b - a) as [triplet, count]}
                        <Row>
                            <Cell>{triplet}</Cell>
                            <Cell>
                                {#if showPercentages}
                                    {((count / totalOccurences) * 100).toFixed(2)}%
                                {:else}
                                    {count}
                                {/if}
                            </Cell>
                        </Row>
                    {/each}
                </Body>
            </DataTable>
        {/if}
    </Content>
    <Actions>
        <!-- This doesn't need an event handler--dialog is automatically closed -->
        <Button><Label>Ok</Label></Button>
    </Actions>
</Dialog>
