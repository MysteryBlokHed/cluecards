<script lang="ts">
    import Button, { Label, Icon } from '@smui/button';

    import { players, suggestions, startingKnowns, playerCardCounts } from '../stores';

    export let setTab: (tab: string) => void;

    function restart() {
        // Note: $playerHands is updated automatically thru App.svelte and does not need to be manually reset
        sessionStorage.clear();
        $players = ['', '', ''];
        $playerCardCounts = [6, 6, 6];
        $suggestions = [];
        $startingKnowns = [];
        setTab('Set Selector');
    }
</script>

<div>
    <h2>Restart Game</h2>
    <p>Click the button below to reset the current game (players, cards, and suggestions).</p>
    <Button on:click={restart}>
        <Label>Restart</Label>
        <Icon class="material-icons">restart_alt</Icon>
    </Button>
</div>
