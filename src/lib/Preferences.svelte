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
        <Switch onchange={persist} bind:checked={$preferences.firstIsSelf} />
        {#snippet label()}
            You are the first player (disable to spectate)
        {/snippet}
    </FormField>
    <br />
    <FormField>
        <Switch
            onchange={persist}
            bind:checked={$preferences.hideFirstColumn}
            disabled={!$preferences.firstIsSelf}
        />
        {#snippet label()}
            Hide the first player's column from the clues
        {/snippet}
    </FormField>

    <h2>QOL</h2>
    <hr />
    <FormField>
        <Switch onchange={persist} bind:checked={$preferences.autoSelectNone} />
        {#snippet label()}
            Auto-change last player's card to "None" after add
        {/snippet}
    </FormField>
    <div>
        <Wrapper>
            <FormField>
                <Switch onchange={persist} bind:checked={$preferences.autoHideImpossible} />
                {#snippet label()}
                    Hide impossible cards from response selector
                {/snippet}
            </FormField>
            <Tooltip>
                Currently, adding a card that should be hidden will just cause the site to crash.
            </Tooltip>
        </Wrapper>
    </div>
    <FormField>
        <Switch onchange={persist} bind:checked={$preferences.selectNextPlayers} />
        {#snippet label()}
            Auto-select player while adding responses
        {/snippet}
    </FormField>
</div>
