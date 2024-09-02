<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import Tooltip, { Wrapper } from '@smui/tooltip';

    import { preferences } from '../stores';
</script>

<Panel>
    <Header>Preferences</Header>
    <Content>
        <h2>Gameplay</h2>
        <hr />
        <FormField>
            <Switch bind:checked={$preferences.firstIsSelf}></Switch>
            <span slot="label">You are the first player (disable to spectate)</span>
        </FormField>

        <h2>QOL</h2>
        <hr />
        <FormField>
            <Switch bind:checked={$preferences.autoSelectNone} />
            <span slot="label">Auto-change last player's card to "None" after add</span>
        </FormField>
        <Wrapper>
            <FormField>
                <Switch bind:checked={$preferences.autoHideImpossible} />
                <span slot="label">Hide impossible cards from response selector</span>
            </FormField>
            <Tooltip>
                Currently, adding a card that should be hidden will just cause the site to crash.
            </Tooltip>
        </Wrapper>
        <FormField>
            <Switch bind:checked={$preferences.selectNextPlayers} />
            <span slot="label">Auto-select player while adding responses</span>
        </FormField>
    </Content>
</Panel>

<style scoped>
    span {
        font-size: 1rem;
    }
</style>
