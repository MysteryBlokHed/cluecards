<script lang="ts">
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import Tooltip, { Wrapper } from '@smui/tooltip';

    import { preferences } from '../stores';

    const persist = () => ($preferences = $preferences);
</script>

<div>
    <h2>Preferences</h2>
    <h2>Gameplay</h2>
    <hr />
    <FormField>
        <Switch on:change={persist} bind:checked={$preferences.firstIsSelf} />
        <span slot="label">You are the first player (disable to spectate)</span>
    </FormField>
    <br />
    <FormField>
        <Switch
            on:change={persist}
            bind:checked={$preferences.hideFirstColumn}
            disabled={!$preferences.firstIsSelf}
        />
        <span slot="label">Hide the first player's column from the clues</span>
    </FormField>

    <h2>QOL</h2>
    <hr />
    <FormField>
        <Switch on:change={persist} bind:checked={$preferences.autoSelectNone} />
        <span slot="label">Auto-change last player's card to "None" after add</span>
    </FormField>
    <div>
        <Wrapper>
            <FormField>
                <Switch on:change={persist} bind:checked={$preferences.autoHideImpossible} />
                <span slot="label">Hide impossible cards from response selector</span>
            </FormField>
            <Tooltip>
                Currently, adding a card that should be hidden will just cause the site to crash.
            </Tooltip>
        </Wrapper>
    </div>
    <FormField>
        <Switch on:change={persist} bind:checked={$preferences.selectNextPlayers} />
        <span slot="label">Auto-select player while adding responses</span>
    </FormField>
</div>

<style scoped>
    span {
        font-size: 1rem;
    }
</style>
