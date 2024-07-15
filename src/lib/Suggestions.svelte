<script lang="ts">
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Icon, Label } from '@smui/button';
    import Paper from '@smui/paper';
    import Tooltip, { Wrapper } from '@smui/tooltip';

    import { players, set } from '../stores';
    import { RevealMethod, type GameSet, type Suggestion } from '../types';
    import { cardTypeToKey, cardTypeToString } from '../cards';

    export let suggestions: Suggestion[];
    export let title: string;
    export let open = false;

    export let remove: (index: number) => void;

    let setContents: GameSet;
    $: setContents = $set[1];
</script>

<Paper>
    <h2 style="margin-bottom: 0;">{title}</h2>
    <Button on:click={() => (open = true)} disabled={!suggestions.length}>
        <Label>Expand All</Label>
        <Icon class="material-icons">unfold_more</Icon>
    </Button>
    <Button on:click={() => (open = false)} disabled={!suggestions.length}>
        <Label>Collapse All</Label>
        <Icon class="material-icons">unfold_less</Icon>
    </Button>

    <Accordion multiple>
        {#each [...suggestions].reverse() as { player, cards, responses }, i}
            <Panel {open} style="background-color: #37373a;">
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
                        <!--
                        FUN FACT! 
                        ithout this <div> element, the <Tooltip> will occasionally
                        crap itself entirely and cause the entire page to crash.
                        That was a fun one to figure out!
                        -->
                        <div>
                            <b>{$players[response.player]}</b>
                            showed
                            <b>{cardTypeToString(response.cardType)}</b>
                            <!-- Show card name if available -->
                            {#if response.cardType >= 0}
                                <b>{setContents[cardTypeToKey(response.cardType)][response.card]}</b
                                >
                            {/if}
                            <!-- If the data was inferred, show a tooltip -->
                            {#if response.source === RevealMethod.InferSuggestion}
                                <Wrapper>
                                    <!-- prettier-ignore -->
                                    <span
                                    tabindex="0"
                                    role="button"
                                    style="font-size: 1em; user-select: none;"
                                    class="material-icons">help</span>

                                    <Tooltip unbounded>This card was inferred.</Tooltip>
                                </Wrapper>
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
