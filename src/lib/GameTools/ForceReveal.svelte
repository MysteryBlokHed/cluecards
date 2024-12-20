<script lang="ts">
    import Button, { Label, Icon } from '@smui/button';
    import DataTable, { Body, Cell, Head, Row } from '@smui/data-table';
    import Dialog, { Actions, Title, Content } from '@smui/dialog';
    import Select, { Option } from '@smui/select';

    import { unpackCard, packSet, cardTypeToKey } from '../../cards';
    import { findSuggestionForces } from '../../inference';
    import { players, playerHands, set } from '../../stores';

    let forceDialogOpen = $state(false);
    let potentialForceTargets: number[] = $state([]);
    let forceTarget: number | null = $state(null);
    let potentialForceSuggestions: Record<number, Array<[string, string[]]>> = $state({});

    function forceReveal() {
        const packedSet = packSet($set[1]);
        potentialForceTargets = [];
        potentialForceSuggestions = {};
        forceTarget = null;

        for (const packed of packedSet) {
            if ($playerHands.every(hand => !hand.has.has(packed))) {
                // Get potential forces
                const forceSuggestionsRaw = findSuggestionForces(packed, $playerHands, $set[1]);
                const forceSuggestions: Array<[string, string[]]> = [];

                for (const force of forceSuggestionsRaw) {
                    // Cards to suggest, ordered by type
                    const cards = [packed, ...force.map(card => card.packed)].sort(
                        (a, b) => unpackCard(a)[0] - unpackCard(b)[0],
                    );

                    // Sources for cards used in force
                    const sourcesRaw = force.map(card => card.source);
                    const sourcesDisp: Record<string, number> = {};

                    for (const source of sourcesRaw) {
                        let key: string;
                        switch (source) {
                            case -2:
                                key = 'All Missing';
                                break;
                            case -1:
                                key = 'Murder Card';
                                break;
                            case 0:
                                key = 'Own Card';
                                break;
                            default:
                                key = $players[source];
                                break;
                        }

                        sourcesDisp[key] ??= 0;
                        sourcesDisp[key]++;
                    }

                    forceSuggestions.push([
                        // Cards to suggest
                        cards
                            .map(packed => {
                                const [type, card] = unpackCard(packed);
                                return $set[1][cardTypeToKey(type)][card];
                            })
                            .join(', '),
                        // Sources for cards used
                        Object.entries(sourcesDisp).map(([source, count]) => `${source}: ${count}`),
                    ]);
                }

                if (forceSuggestions.length) {
                    potentialForceTargets.push(packed);
                    potentialForceSuggestions[packed] = forceSuggestions;
                }
            }
        }

        forceDialogOpen = true;
    }
</script>

<div>
    <Button onclick={forceReveal} variant="raised" color="secondary" style="width: 100%;">
        <Label>Force Reveal</Label>
        <Icon class="material-icons">build</Icon>
    </Button>
    <br />
    See if there are any cards that can be forced to reveal with a suggestion.
</div>

<Dialog
    bind:open={forceDialogOpen}
    aria-labelledby="force-title"
    aria-describedby="force-content"
    surface$style="width: 500px; max-width: calc(100vw - 32px); min-height: 45vh;"
>
    <Title id="force-title">Force Reveal</Title>
    <Content id="force-content">
        <Select
            bind:value={forceTarget}
            label="Card to force"
            menu$class="force-menu"
            disabled={!potentialForceTargets.length}
        >
            {#each potentialForceTargets as potential}
                {@const [type, card] = unpackCard(potential)}
                <Option value={potential}>{$set[1][cardTypeToKey(type)][card]}</Option>
            {/each}
        </Select>
        <br />
        {#if forceTarget != null && potentialForceSuggestions[forceTarget].length}
            <DataTable>
                <Head>
                    <Row>
                        <Cell>Cards</Cell>
                        <Cell>Sources</Cell>
                    </Row>
                </Head>
                <Body>
                    {#each potentialForceSuggestions[forceTarget] as [cards, sources]}
                        <Row>
                            <Cell>{cards}</Cell>
                            <Cell>
                                {#each sources as source}
                                    <span>{source}</span>
                                    <br />
                                {/each}
                            </Cell>
                        </Row>
                    {/each}
                </Body>
            </DataTable>
            <br />
        {:else if forceTarget != null}
            {@const [type, card] = unpackCard(forceTarget)}
            <h2>Cannot force {$set[1][cardTypeToKey(type)][card]}</h2>
        {:else if potentialForceTargets.length}
            <h2>Select a card</h2>
            <h3>If a card is not listed, it cannot be forced.</h3>
        {:else}
            <h3>No cards can currently be forced.</h3>
        {/if}
        <b>
            Note: Forcing a reveal like this can also reveal information to other players if they
            know one or both of the cards besides the target card. If there are multiple ways to
            make the reveal happen, you can preview other players' clue sheets to see what cards
            they know about.
        </b>
    </Content>
    <Actions>
        <!-- This doesn't need an event handler--dialog is automatically closed -->
        <Button>Close</Button>
    </Actions>
</Dialog>
