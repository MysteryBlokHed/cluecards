<script lang="ts">
    import { players, suggestions, startingKnowns, playerCardCounts } from '../../stores';

    export interface Props {
        setTab: (tab: string) => void;
    }

    let { setTab }: Props = $props();

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

<div class="card-body">
    <h2 class="card-title">Restart Game</h2>
    <p>Click the button below to reset the current game (players, cards, and suggestions).</p>
    <button class="btn btn-primary" onclick={restart}>
        Restart
        <span class="material-icons">restart_alt</span>
    </button>
</div>
