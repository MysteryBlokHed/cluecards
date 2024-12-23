<script lang="ts">
    import { preferences } from '../stores';
</script>

<div class="card-body">
    <h2 class="card-title">Preferences</h2>
    <h3 class="text-xl">Gameplay</h3>
    <hr />
    <div class="form-control">
        <label class="label justify-center">
            <input type="checkbox" class="toggle mx-1" bind:checked={$preferences.firstIsSelf} />
            <span class="label-text mx-1">You are the first player (disable to spectate)</span>
        </label>
    </div>
    <div class="form-control">
        <label class="label justify-center">
            <input
                type="checkbox"
                class="toggle"
                bind:checked={$preferences.hideFirstColumn}
                disabled={!$preferences.firstIsSelf}
            />
            <span class="label-text mx-1">Hide the first player's column from the clues</span>
        </label>
    </div>

    <h3 class="text-xl">QOL</h3>
    <hr />
    <div class="form-control">
        <label class="label justify-center">
            <input type="checkbox" class="toggle mx-1" bind:checked={$preferences.autoSelectNone} />
            <span class="label-text mx-1">Auto-change last player's card to "None" after add</span>
        </label>
    </div>
    <div>
        <div
            class="tooltip"
            data-tip="Currently, adding a card that should be hidden will just cause the site to crash."
        >
            <div class="form-control">
                <label class="label justify-center">
                    <input
                        type="checkbox"
                        class="toggle mx-1"
                        bind:checked={$preferences.autoHideImpossible}
                    />
                    <span class="label-text mx-1">Hide impossible cards from response selector</span
                    >
                </label>
            </div>
        </div>
    </div>
    <div class="form-control">
        <label class="label justify-center">
            <input
                type="checkbox"
                class="toggle mx-1"
                bind:checked={$preferences.selectNextPlayers}
            />
            <span class="label-text mx-1">Auto-select player while adding responses</span>
        </label>
    </div>
</div>
