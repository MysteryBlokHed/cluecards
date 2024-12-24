<script lang="ts">
    import { compressToBase64 } from 'lz-string';
    import { untrack } from 'svelte';

    import SETS from '../../sets';
    import { set, sets } from '../../stores';

    import SetManager from './SetManager/';

    let setName = $state($set[0]);

    // Update the active set if setName changes
    $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        setName;
        untrack(() => ($set = [setName, $sets.get(setName)!]));
    });

    // Update setName if the active set changes
    $effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        $set;
        untrack(() => (setName = $set[0]));
    });

    let creator: SetManager;

    function deleteSet() {
        $sets.delete(setName);
        setName = $sets.keys().next().value!;
        $set = [setName, $sets.get(setName)!];
        $sets = $sets;
    }

    function restore() {
        for (const builtin of Object.keys(SETS) as Array<keyof typeof SETS>) {
            $sets.set(builtin, structuredClone(SETS[builtin]));
        }

        $sets = $sets;
        $set = [$set[0], $sets.get($set[0])!];
    }
</script>

<SetManager bind:this={creator} />
<div class="card-body">
    <h2 class="card-title">Set Selector</h2>
    <span>The version of the game being used.</span>
    <br />

    <div class="flex items-center justify-center gap-2">
        <select class="select select-bordered" bind:value={setName}>
            {#each $sets.keys() as name}
                <option value={name}>{name}</option>
            {/each}
        </select>

        <button class="btn btn-circle" onclick={() => creator.openCreator(setName)}>
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
        <button class="btn btn-ghost text-primary" onclick={() => creator.openCreator(null)}>
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
