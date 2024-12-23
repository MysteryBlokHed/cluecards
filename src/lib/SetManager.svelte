<script lang="ts">
    import { set as activeSet, sets } from '../stores';
    import type { GameSet } from '../types';
    import { decompressFromBase64 } from 'lz-string';

    export interface Props {
        updating: string | null;
    }

    let creator: HTMLDialogElement;

    export function openCreator() {
        creator.showModal();
    }

    let { updating = $bindable() }: Props = $props();

    let setName: string = $state('');
    // @ts-expect-error This null is resolved before anything actually tries to use it
    let set: GameSet = $state(null);

    function updateActiveSet(updating: string | null) {
        if (updating != null) {
            setName = updating;
            set = structuredClone($sets[setName]);
        }
    }

    $effect(() => updateActiveSet(updating));

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
        set = {
            suspects: ['', '', '', '', '', ''],
            weapons: ['', '', '', '', '', ''],
            rooms: ['', '', '', '', '', '', '', '', ''],
        };
    }

    function saveSet() {
        $sets[setName] = set;
        $sets = $sets;
        // Reload set if we are updating the active one
        if ($activeSet[0] === updating) {
            $activeSet = [updating, $sets[updating]];
        }
        setName = '';
        updating = null;
        resetSet();
    }

    resetSet();
</script>

<!-- Set Creator Dialog -->
<dialog
    class="modal"
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
            disabled={updating != null}
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
                            <div class="flex">
                                <input
                                    type="text"
                                    class="input input-bordered"
                                    bind:value={set.suspects[i]}
                                    placeholder="Suspect"
                                />
                                <button
                                    class="btn btn-circle"
                                    onclick={() => {
                                        set.suspects.splice(i, 1);
                                        set.suspects = set.suspects;
                                    }}
                                >
                                    <span class="material-icons">delete</span>
                                </button>
                                <br />
                            </div>
                        {/each}
                    </td>
                    <td>
                        <br />
                        {#each set.weapons, i}
                            <div class="flex">
                                <input
                                    type="text"
                                    class="input input-bordered"
                                    bind:value={set.weapons[i]}
                                    placeholder="Weapon"
                                />
                                <button
                                    class="btn btn-circle"
                                    onclick={() => {
                                        set.weapons.splice(i, 1);
                                        set.weapons = set.weapons;
                                    }}
                                >
                                    <span class="material-icons">delete</span>
                                </button>
                                <br />
                            </div>
                        {/each}
                    </td>
                    <td>
                        <br />
                        {#each set.rooms, i}
                            <div class="flex">
                                <input
                                    type="text"
                                    class="input input-bordered"
                                    bind:value={set.rooms[i]}
                                    placeholder="Room"
                                />
                                <button
                                    class="btn btn-circle"
                                    onclick={() => {
                                        set.rooms.splice(i, 1);
                                        set.rooms = set.rooms;
                                    }}
                                >
                                    <span class="material-icons">delete</span>
                                </button>
                                <br />
                            </div>
                        {/each}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="modal-action">
            <form method="dialog">
                <button class="btn">
                    Cancel
                    <span class="material-icons">delete_forever</span>
                </button>
                <button class="btn btn-primary" onclick={saveSet} disabled={!setIsValid}>
                    Save
                    <span class="material-icons">save</span>
                </button>
            </form>
        </div>
    </div>
</dialog>
