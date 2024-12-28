<script lang="ts">
    import { preferences } from '../../stores';
</script>

{#snippet preference(
    property: string & keyof typeof $preferences,
    label: string,
    disabled: boolean = false,
)}
    <div class="form-control">
        <label class="label justify-center">
            <input
                type="checkbox"
                class="toggle mx-1"
                bind:checked={$preferences[property]}
                {disabled}
            />
            <span class="label-text mx-1">{label}</span>
        </label>
    </div>
{/snippet}

<div class="card-body">
    <h2 class="card-title">Preferences</h2>
    <h3 class="text-xl">Gameplay</h3>
    <hr />
    {@render preference(
        'disableInference',
        'Disable inference (can be used to keep a log for game audits)',
    )}
    {@render preference(
        'firstIsSelf',
        'You are the first player (disable to spectate)',
        $preferences.disableInference,
    )}
    {@render preference(
        'hideFirstColumn',
        "Hide the first player's column from the clues",
        !$preferences.firstIsSelf || $preferences.disableInference,
    )}

    <h3 class="text-xl">QOL</h3>
    <hr />
    {@render preference('autoSelectNone', 'Auto-change last player\'s card to "None" after add')}
    <div
        class="tooltip"
        data-tip="Currently, adding a card that should be hidden will just cause the site to crash."
    >
        {@render preference('autoHideImpossible', 'Hide impossible cards from response selector')}
    </div>
    {@render preference('selectNextPlayers', 'Auto-select player while adding responses')}
</div>
