<script lang="ts">
    import { packCard, unpackCard } from '../cards';
    import { players, playerHands, set, suggestions, preferences } from '../stores';
    import { CardType, RevealMethod, type Suggestion, type SuggestionResponse } from '../types';

    interface WorkingSuggestionRespose extends Partial<SuggestionResponse> {
        player: number;
        packed?: number | undefined;
        cardType?: CardType | undefined;
        card?: number | undefined;
        source?: RevealMethod | undefined;
    }

    let setContents = $derived($set[1]);

    let player: number | null = $state(null);
    let suspect: number | null = $state(null);
    let weapon: number | null = $state(null);
    let room: number | null = $state(null);
    let responses: WorkingSuggestionRespose[] = $state([]);

    let suspectPacked = $derived(suspect != null ? packCard(CardType.Suspect, suspect) : -1);
    let weaponPacked = $derived(weapon != null ? packCard(CardType.Weapon, weapon) : -1);
    let roomPacked = $derived(room != null ? packCard(CardType.Room, room) : -1);

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

        responses.push({
            player: responder!,
            packed: -1,
        });
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

        $suggestions.push(suggestion);

        player = suspect = weapon = room = null;
        responses = [];
    }
</script>

<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title">Add Suggestion</h2>

        <div>
            <select class="select select-bordered" bind:value={player} style="width: 150px;">
                <!-- Pseudo-placeholder -->
                <option value={null} disabled hidden selected>Player</option>
                {#each $players as playerName, i}
                    <option value={i}>{playerName}</option>
                {/each}
            </select>
            suggests
            <select class="select select-bordered" bind:value={suspect} style="width: 150px;">
                <!-- Pseudo-placeholder -->
                <option value={null} disabled hidden selected>Suspect</option>
                {#each setContents.suspects as suspect, i}
                    <option value={i}>{suspect}</option>
                {/each}
            </select>
            used
            <select class="select select-bordered" bind:value={weapon} style="width: 150px;">
                <!-- Pseudo-placeholder -->
                <option value={null} disabled hidden selected>Weapon</option>
                {#each setContents.weapons as weapon, i}
                    <option value={i}>{weapon}</option>
                {/each}
            </select>
            in
            <select class="select select-bordered" bind:value={room}>
                <!-- Pseudo-placeholder -->
                <option value={null} disabled hidden selected>Room</option>
                {#each setContents.rooms as room, i}
                    <option value={i}>{room}</option>
                {/each}
            </select>
        </div>

        <h3>
            Responses
            <button class="btn btn-primary h-10 min-h-10" onclick={addResponse}>
                Add
                <span class="material-icons">add_circle</span>
            </button>
            <div class="tooltip" data-tip="None of the players showed a card.">
                <button class="btn btn-secondary h-10 min-h-10" onclick={addNoneResponses}>
                    No Responses
                    <span class="material-icons">help</span>
                </button>
            </div>
        </h3>
        {#if responses.length === 0}
            You must specify a response (including no cards shown).
        {/if}
        {#each responses as response, i}
            <div class="flex items-center justify-center">
                <select
                    class="select select-bordered"
                    bind:value={response.player}
                    style="width: 150px;"
                >
                    {#each $players as playerName, i}
                        <option value={i}>{playerName}</option>
                    {/each}
                </select>

                shows card

                <select
                    class="select select-bordered"
                    bind:value={response.packed}
                    style="width: 150px;"
                >
                    <!-- Unknown card -->
                    <option value={-1}>Unknown</option>
                    <!-- Suggested suspect card -->
                    {#if suspect != null && ($preferences.autoHideImpossible ? !$playerHands[response.player].missing.has(suspectPacked) : true)}
                        <option value={suspectPacked}>
                            {setContents.suspects[suspect]}
                        </option>
                    {/if}
                    <!-- Suggested weapon card -->
                    {#if weapon != null && ($preferences.autoHideImpossible ? !$playerHands[response.player].missing.has(weaponPacked) : true)}
                        <option value={weaponPacked}>
                            {setContents.weapons[weapon]}
                        </option>
                    {/if}
                    <!-- Suggested room card -->
                    {#if room != null && ($preferences.autoHideImpossible ? !$playerHands[response.player].missing.has(roomPacked) : true)}
                        <option value={roomPacked}>
                            {setContents.rooms[room]}
                        </option>
                    {/if}
                    <!-- Nothing was shown -->
                    <option value={-2}>None</option>
                </select>
                <button
                    class="btn btn-circle"
                    onclick={() => {
                        responses.splice(i, 1);
                        responses = responses;
                    }}
                >
                    <span class="material-icons"> delete </span>
                </button>
                <br />
            </div>
        {/each}

        <br />

        <button class="btn btn-primary" onclick={saveSuggestion} disabled={!responses.length}>
            Save Suggestion
            <span class="material-icons">save</span>
        </button>
    </div>
</div>
