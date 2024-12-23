<script lang="ts">
    import { compressToBase64 } from 'lz-string';

    import SetManager from './SetManager.svelte';

    import SETS from '../sets';
    import { set, sets } from '../stores';

    let setName = $state($set[0]);
    $effect(() => {
        $set = [setName, $sets[setName]];
    });

    let creator: SetManager;

    let updating: string | null = $state(null);

    function deleteSet() {
        delete $sets[setName];
        setName = Object.keys($sets)[0];
        $set = [setName, $sets[setName]];
        $sets = $sets;
    }

    function restore() {
        for (const builtin of Object.keys(SETS) as Array<keyof typeof SETS>) {
            $sets[builtin] = structuredClone(SETS[builtin]);
        }

        $sets = $sets;
        $set = [$set[0], $sets[$set[0]]];
    }
</script>

<SetManager bind:this={creator} bind:updating />
<div class="card-body">
    <h2 class="card-title">Set Selector</h2>
    <span>The version of the game being used.</span>
    <br />

    <div class="flex items-center justify-center gap-2">
        <select class="select select-bordered" bind:value={setName}>
            {#each Object.keys($sets) as name}
                <option value={name}>{name}</option>
            {/each}
        </select>

        <button
            class="btn btn-circle"
            onclick={() => {
                updating = setName;
                creator.openCreator();
            }}
        >
            <span class="material-icons">edit</span>
        </button>
        <div class="tooltip" data-tip="Export this set to a shareable string.">
            <button
                class="btn btn-circle"
                onclick={() => {
                    navigator.clipboard.writeText(compressToBase64(JSON.stringify($set)));
                }}
            >
                <span class="material-icons">content_copy</span>
            </button>
        </div>
        <button class="btn btn-circle" onclick={deleteSet}>
            <span class="material-icons">delete</span>
        </button>
    </div>

    <div>
        <button
            class="btn btn-ghost text-primary"
            onclick={() => {
                updating = null;
                creator.openCreator();
            }}
        >
            Create New Set
            <span class="material-icons">add</span>
        </button>
        <div
            class="tooltip tooltip-bottom"
            data-tip="Restore the builtin sets to their default values."
        >
            <button class="btn btn-ghost text-primary" onclick={restore}>
                Reload Builtin Sets
                <span class="material-icons">restart_alt</span>
            </button>
        </div>
    </div>
</div>
