<script lang="ts">
    import { decompressFromBase64 } from 'lz-string';
    import { untrack } from 'svelte';

    import { set as activeSet, sets } from '../../stores';
    import type { GameSet } from '../../types';

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

    /**
     * Tries to add a new empty field to a set category, keeping max card count in mind
     * (can be at most 16 cards per set due to bitmask implementation in inference).
     * This situation can never happen in a standard Clue set, but I'm trying to keep the implementation
     * mostly generic so that people can use their own weird modified sets if they want.
     * @param category The category to push to (modified directly)
     */
    function tryAddNew(category: string[]): boolean {
        if (category.length < 16) {
            category.push('');
            return true;
        }
        return false;
    }

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
            $sets = $sets;
        }

        // Reload active set
        $activeSet = [setName, set];

        resetSet();
    }

    resetSet();
</script>

{#snippet creatorItem(i: number, set: string[], placeholder: string)}
    <div class="flex">
        <input type="text" class="input input-bordered" bind:value={set[i]} {placeholder} />
        <button class="btn btn-circle btn-ghost" onclick={() => set.splice(i, 1)}>
            <span class="material-icons">delete</span>
        </button>
        <br />
    </div>
{/snippet}

<!-- Set Creator Dialog -->
<dialog
    class="modal"
    oncancel={e => e.preventDefault()}
    aria-labelledby="creator-title"
    aria-describedby="creator-content"
    bind:this={creator}
>
    <div class="modal-box max-w-fit" id="creator-content">
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

        <div class="creator-fields">
            <div>
                <button class="btn w-full" onclick={() => tryAddNew(set.suspects)}>
                    Add Suspect
                    <span class="material-icons">add</span>
                </button>
            </div>
            <div>
                <button class="btn w-full" onclick={() => tryAddNew(set.weapons)}>
                    Add Weapon
                    <span class="material-icons">add</span>
                </button>
            </div>
            <div>
                <button class="btn w-full" onclick={() => tryAddNew(set.rooms)}>
                    Add Room
                    <span class="material-icons">add</span>
                </button>
            </div>

            <div>
                <br />
                {#each set.suspects, i}
                    {@render creatorItem(i, set.suspects, 'Suspect')}
                {/each}
            </div>
            <div>
                <br />
                {#each set.weapons, i}
                    {@render creatorItem(i, set.weapons, 'Weapon')}
                {/each}
            </div>
            <div>
                <br />
                {#each set.rooms, i}
                    {@render creatorItem(i, set.rooms, 'Room')}
                {/each}
            </div>
        </div>

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

<style scoped>
    .creator-fields {
        display: grid;
        gap: 1rem;
        grid-template-columns: 1fr 1fr 1fr;
    }

    @media only screen and (max-width: 900px) {
        .creator-fields {
            grid-template-columns: 1fr;
        }
    }
</style>
