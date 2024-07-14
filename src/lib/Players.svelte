<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Icon, Label } from '@smui/button';
    import IconButton from '@smui/icon-button';
    import Textfield from '@smui/textfield';

    import { players, playerHands } from '../stores';
</script>

<Panel>
    <Header>Players</Header>
    <Content>
        {#each $players as player, i}
            <div>
                <Textfield bind:value={player} label={i === 0 ? 'Your Name' : 'Player Name'} />
                <IconButton
                    class="material-icons"
                    on:click={() => {
                        $players.splice(i, 1);
                        $playerHands.splice(i, 1);
                        $players = $players;
                        $playerHands = $playerHands;
                    }}>delete</IconButton
                >
            </div>
        {/each}

        <Button
            on:click={() => {
                $players = [...$players, ''];
                $playerHands = [
                    ...$playerHands,
                    { has: new Set(), missing: new Set(), maybe: new Set() },
                ];
            }}
        >
            <Label>Add</Label>
            <Icon class="material-icons">add</Icon>
        </Button>
    </Content>
</Panel>
