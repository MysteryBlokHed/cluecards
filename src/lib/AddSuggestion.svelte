<script lang="ts">
    import Button, { Label, Icon } from '@smui/button';
    import IconButton from '@smui/icon-button';
    import Paper from '@smui/paper';
    import Select, { Option } from '@smui/select';
    import Tooltip, { Wrapper } from '@smui/tooltip';

    import { players, playerHands, set, suggestions, preferences } from '../stores';
    import {
        CardType,
        RevealMethod,
        type GameSet,
        type Suggestion,
        type SuggestionResponse,
    } from '../types';
    import { packCard, unpackCard } from '../cards';

    interface WorkingSuggestionRespose extends Partial<SuggestionResponse> {
        player: number;
        packed?: number | undefined;
        cardType?: CardType | undefined;
        card?: number | undefined;
        source?: RevealMethod | undefined;
    }

    let setContents: GameSet;
    $: setContents = $set[1];

    let player: number | null = null;
    let suspect: number | null = null;
    let weapon: number | null = null;
    let room: number | null = null;
    let responses: WorkingSuggestionRespose[] = [];

    let suspectPacked = -1;
    let weaponPacked = -1;
    let roomPacked = -1;

    $: suspectPacked = suspect != null ? packCard(CardType.Suspect, suspect) : -1;
    $: weaponPacked = weapon != null ? packCard(CardType.Weapon, weapon) : -1;
    $: roomPacked = room != null ? packCard(CardType.Room, room) : -1;

    function addResponse() {
        let responder: number;
        if ($preferences.selectNextPlayers) {
            // Auto-select either the player after the most recent response, or just the player after the suggestor
            if (responses.length) {
                responder = responses.at(-1)!.player + 1;
            } else {
                responder = (player ?? 0) + 1;
            }

            // Do not overflow
            if (responder > $players.length - 1) {
                responder = 0;
            }
        }

        // If there is a response before this one whose card type is unknown, switch it to none
        // Done for convenience since only one player should be showing a card at a time
        if ($preferences.autoSelectNone) {
            const previous = responses.at(-1);
            if (previous && previous.packed === -1) previous.packed = -2;
        }

        responses = [
            ...responses,
            {
                player: responder!,
                packed: -1,
            },
        ];
    }

    function addNoneResponses() {
        // Create list of players (numbers) except for suggestor
        const responders: number[] = new Array($players.length);
        for (let i = 0; i < $players.length; i++) responders[i] = i;

        // Rotate array so that the suggestor is listed last
        for (let i = 0; i < (player ?? 0) + 1; i++) {
            responders.push(responders.shift()!);
        }

        // Remove suggestor
        responders.pop();

        // Create responses
        for (const responder of responders) {
            responses.push({ player: responder, packed: CardType.Nothing });
        }

        responses = responses;
    }

    function saveSuggestion() {
        if (player == null || suspect == null || weapon == null || room == null) return;

        for (const response of responses) {
            if (response.packed! < 0) {
                response.cardType = response.packed;
                response.card = -1;
            } else {
                [response.cardType, response.card] = unpackCard(response.packed!);
                // Specify source of card info
                if (response.player === 0) response.source = RevealMethod.Self;
                else response.source = RevealMethod.Direct;
            }

            delete response.packed;
        }

        const suggestion: Suggestion = {
            player,
            cards: [suspect, weapon, room],
            responses: responses as SuggestionResponse[],
        };

        $suggestions = [...$suggestions, suggestion];

        player = suspect = weapon = room = null;
        responses = [];
    }
</script>

<Paper>
    <h2 style="margin-bottom: 0;">Add Suggestion</h2>

    <Select bind:value={player} label="Player" style="width: 150px;">
        {#each $players as playerName, i}
            <Option value={i}>{playerName}</Option>
        {/each}
    </Select>
    suggests
    <Select bind:value={suspect} label="Suspect" style="width: 150px;">
        {#each setContents.suspects as suspect, i}
            <Option value={i}>{suspect}</Option>
        {/each}
    </Select>
    used
    <Select bind:value={weapon} label="Weapon" style="width: 150px;">
        {#each setContents.weapons as weapon, i}
            <Option value={i}>{weapon}</Option>
        {/each}
    </Select>
    in
    <Select bind:value={room} label="Room">
        {#each setContents.rooms as room, i}
            <Option value={i}>{room}</Option>
        {/each}
    </Select>

    <h3>
        Responses
        <Button onclick={addResponse} variant="raised">
            <Label>Add</Label>
            <Icon class="material-icons">add_circle</Icon>
        </Button>
        <Wrapper>
            <Button onclick={addNoneResponses} variant="raised" color="secondary">
                <Label>No Responses</Label>
                <Icon class="material-icons">help</Icon>
            </Button>
            <Tooltip>None of the players showed a card.</Tooltip>
        </Wrapper>
    </h3>
    {#if responses.length === 0}
        You must specify a response (including no cards shown).
    {/if}
    {#each responses as response, i}
        <Select bind:value={response.player} label="Player" style="width: 150px;">
            {#each $players as playerName, i}
                <Option value={i}>{playerName}</Option>
            {/each}
        </Select>
        shows card
        <Select bind:value={response.packed} label="Card" style="width: 150px;">
            <!-- Unknown card -->
            <Option value={-1}>Unknown</Option>
            <!-- Suggested suspect card -->
            {#if suspect != null && ($preferences.autoHideImpossible ? !$playerHands[response.player].missing.has(suspectPacked) : true)}
                <Option value={suspectPacked}>
                    {setContents.suspects[suspect]}
                </Option>
            {/if}
            <!-- Suggested weapon card -->
            {#if weapon != null && ($preferences.autoHideImpossible ? !$playerHands[response.player].missing.has(weaponPacked) : true)}
                <Option value={weaponPacked}>
                    {setContents.weapons[weapon]}
                </Option>
            {/if}
            <!-- Suggested room card -->
            {#if room != null && ($preferences.autoHideImpossible ? !$playerHands[response.player].missing.has(roomPacked) : true)}
                <Option value={roomPacked}>
                    {setContents.rooms[room]}
                </Option>
            {/if}
            <!-- Nothing was shown -->
            <Option value={-2}>None</Option>
        </Select>
        <IconButton
            class="material-icons"
            onclick={() => {
                responses.splice(i, 1);
                responses = responses;
            }}>delete</IconButton
        >
        <br />
    {/each}

    <br />

    <Button onclick={saveSuggestion} disabled={!responses.length} variant="raised">
        <Label>Save Suggestion</Label>
        <Icon class="material-icons">save</Icon>
    </Button>
</Paper>
