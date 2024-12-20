<script lang="ts">
    import Button, { Icon, Label } from '@smui/button';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';

    import { cardTypeToKey } from '../../cards';
    import { probabilities } from '../../inference';
    import { playerCardCounts, playerHands, preferences, set, startingKnowns } from '../../stores';
    import type { Suggestion } from '../../types';

    export interface Props {
        amendedSuggestions: readonly Suggestion[];
    }

    let { amendedSuggestions }: Props = $props();

    let oddsOpen = $state(false);
    let showPercentages = $state(true);
    let overrideBody = $state('');
    let oddsTable: Record<string, number> = $state({});
    let totalOccurences = $state(0);

    function calculateOdds() {
        oddsTable = {};
        totalOccurences = 0;

        let probs: ReturnType<typeof probabilities>;

        console.time('Calculating and displaying probabilities');

        try {
            probs = probabilities(
                $state.snapshot(amendedSuggestions) as Suggestion[],
                $set[1],
                $state.snapshot($playerHands),
                $playerCardCounts,
                $preferences.firstIsSelf,
                $startingKnowns,
            );
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
        console.table($state.snapshot(oddsTable));

        console.timeEnd('Calculating and displaying probabilities');

        oddsOpen = true;
    }
</script>

<div>
    <Button variant="raised" color="secondary" onclick={calculateOdds} style="width: 100%;">
        <Label>Calculate Odds</Label>
        <Icon class="material-icons">casino</Icon>
    </Button>
    <br />
    Try to find the most likely murder cards. This option is experimental and likely innacurate. Probabilities
    are not foolproof. Only use this as a last-resort if you think a player is going to make a correct
    accusation before you.
</div>

<Dialog bind:open={oddsOpen} aria-labelledby="odds-title" aria-describedby="odds-content">
    <Title id="odds-title">Odds</Title>
    <Content id="odds-content" style="display: flex; flex-direction: column;">
        {#if overrideBody}
            {overrideBody}
        {:else}
            <FormField>
                <Switch bind:checked={showPercentages} />
                {#snippet label()}
                    Show Percentages
                {/snippet}
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
