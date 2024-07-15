<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Label, Icon } from '@smui/button';

    import { players, suggestions, startingKnowns } from '../stores';

    let open: boolean;

    function restart() {
        // Note: $playerHands is updated automatically thru App.svelte and does not need to be manually reset
        sessionStorage.clear();
        $players = [''];
        $suggestions = [];
        $startingKnowns = [];
        open = false;
    }
</script>

<Panel bind:open>
    <Header>Restart Game</Header>
    <Content
        style="text-align: center; display: flex; flex-direction: column; place-items: center;"
    >
        <p>Click the button below to reset the current game (players, cards, and suggestions).</p>
        <Button on:click={restart}>
            <Label>Restart</Label>
            <Icon class="material-icons">restart_alt</Icon>
        </Button>
    </Content>
</Panel>
