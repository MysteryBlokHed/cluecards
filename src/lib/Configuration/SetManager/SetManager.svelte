<script lang="ts">
    import { untrack } from 'svelte';
    import { set as activeSet, sets } from '../../../stores';
    import type { GameSet } from '../../../types';
    import { decompressFromBase64 } from 'lz-string';
    import SetManagerItem from './SetManagerItem.svelte';

    let creator: HTMLDialogElement;

    let updating: string | null = $state(null);

    export function openCreator(setUpdating: string | null) {
        updating = setUpdating;
        creator.showModal();
    }

    let setName: string = $state('');
    let set: GameSet = $state(null) as unknown as GameSet;

    $effect(() => {
        if (updating != null) {
            untrack(() => {
                setName = updating!;
                set = $state.snapshot($sets.get(updating!)!);
            });
        }
    });

    let setIsValid = $derived.by(() => {
        if (!set) return false;
        // Ensure at least 2 of each category
        if (set.suspects.length < 2 || set.weapons.length < 2 || set.rooms.length < 2) {
            return false;
        }
        // Ensure everything has a value
        if (
            set.suspects.some(val => !val) ||
            set.weapons.some(val => !val) ||
            set.rooms.some(val => !val)
        ) {
            return false;
        }
        // Ensure values are unique across all categories
        const suspectSet = new Set(set.suspects.map(val => val.trim()));
        const weaponSet = new Set(set.weapons.map(val => val.trim()));
        const roomSet = new Set(set.rooms.map(val => val.trim()));
        const totalSet = suspectSet.union(weaponSet).union(roomSet);
        if (totalSet.size !== set.suspects.length + set.weapons.length + set.rooms.length) {
            return false;
        }

        return true;
    });

    function resetSet() {
        updating = null;
        setName = '';
        set = {
            suspects: ['', '', '', '', '', ''],
            weapons: ['', '', '', '', '', ''],
            rooms: ['', '', '', '', '', '', '', '', ''],
        };
    }

    function saveSet() {
        // If the user renamed an existing set, delete the old version of it and reinsert this set in its place
        if (updating != null && setName !== updating) {
            // Sets to array
            const setsEntries = [...$sets.entries()];
            // Find the set we're updating
            const updatingIndex = setsEntries.findIndex(([name]) => name === updating);
            // Swap it with the new version
            setsEntries[updatingIndex] = [setName, set];
            $sets = new Map(setsEntries);
        } else {
            $sets.set(setName, set);
        }

        // Reload set if we are updating the active one
        if ($activeSet[0] === updating) {
            $activeSet = [setName, set];
        }

        resetSet();
    }

    resetSet();
</script>

<!-- Set Creator Dialog -->
<dialog
    class="modal"
    oncancel={e => e.preventDefault()}
    aria-labelledby="creator-title"
    aria-describedby="creator-content"
    bind:this={creator}
>
    <div class="modal-box w-fit min-w-fit" id="creator-content">
        <h2 class="text-xl" id="creator-title">Set Creator</h2>
        <p>Create a custom game set.</p>
        <button
            class="btn btn-ghost w-full"
            onclick={() => {
                const data = prompt('Paste the exported string here:');
                if (data) {
                    try {
                        const parsed = JSON.parse(decompressFromBase64(data));
                        setName = parsed[0];
                        set = parsed[1];
                    } catch {
                        alert('Invalid data.');
                    }
                }
            }}
        >
            Import
            <span class="material-icons">download</span>
        </button>
        <br />
        <input
            type="text"
            class="input input-bordered"
            placeholder="Set Name"
            bind:value={setName}
        />
        <table>
            <tbody>
                <tr>
                    <td>
                        <button
                            class="btn w-full"
                            onclick={() => (set.suspects = [...set.suspects, ''])}
                        >
                            Add Suspect
                            <span class="material-icons">add</span>
                        </button>
                    </td>
                    <td>
                        <button
                            class="btn w-full"
                            onclick={() => (set.weapons = [...set.weapons, ''])}
                        >
                            Add Weapon
                            <span class="material-icons">add</span>
                        </button>
                    </td>
                    <td>
                        <button class="btn w-full" onclick={() => (set.rooms = [...set.rooms, ''])}>
                            Add Room
                            <span class="material-icons">add</span>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        {#each set.suspects, i}
                            <SetManagerItem {i} set={set.suspects} placeholder="Suspect" />
                        {/each}
                    </td>
                    <td>
                        <br />
                        {#each set.weapons, i}
                            <SetManagerItem {i} set={set.weapons} placeholder="Weapon" />
                        {/each}
                    </td>
                    <td>
                        <br />
                        {#each set.rooms, i}
                            <SetManagerItem {i} set={set.rooms} placeholder="Room" />
                        {/each}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="modal-action">
            <form method="dialog">
                <button
                    class="btn"
                    onclick={() => {
                        creator.close();
                        resetSet();
                    }}
                >
                    Cancel
                    <span class="material-icons">delete_forever</span>
                </button>
                <button
                    class="btn btn-primary"
                    onclick={() => {
                        creator.close();
                        saveSet();
                    }}
                    disabled={!setIsValid}
                >
                    Save
                    <span class="material-icons">save</span>
                </button>
            </form>
        </div>
    </div>
</dialog>
