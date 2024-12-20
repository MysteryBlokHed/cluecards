<script lang="ts">
    import Button, { Label, Icon } from '@smui/button';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import IconButton from '@smui/icon-button';
    import Textfield from '@smui/textfield';

    import { set as activeSet, sets } from '../stores';
    import type { GameSet } from '../types';
    import { decompressFromBase64 } from 'lz-string';

    export interface Props {
        creatorOpen: boolean;
        updating: string | null;
    }

    let { creatorOpen = $bindable(), updating = $bindable() }: Props = $props();

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
<Dialog
    bind:open={creatorOpen}
    scrimClickAction=""
    escapeKeyAction=""
    aria-labelledby="creator-title"
    aria-describedby="creator-content"
    surface$style="width: 850px; max-width: calc(100vw - 32px);"
>
    <Title id="creator-title">Set Creator</Title>
    <Content id="creator-content" style="display: flex; flex-direction: column;">
        <p>Create a custom game set.</p>
        <Button
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
            <Label>Import</Label>
            <Icon class="material-icons">download</Icon>
        </Button>
        <Textfield bind:value={setName} label="Set Name" disabled={updating != null} />
        <table>
            <tbody>
                <tr>
                    <td>
                        <Button onclick={() => (set.suspects = [...set.suspects, ''])}>
                            <Label>Add Suspect</Label>
                            <Icon class="material-icons">add</Icon>
                        </Button>
                    </td>
                    <td>
                        <Button onclick={() => (set.weapons = [...set.weapons, ''])}>
                            <Label>Add Weapon</Label>
                            <Icon class="material-icons">add</Icon>
                        </Button>
                    </td>
                    <td>
                        <Button onclick={() => (set.rooms = [...set.rooms, ''])}>
                            <Label>Add Room</Label>
                            <Icon class="material-icons">add</Icon>
                        </Button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        {#each set.suspects, i}
                            <Textfield bind:value={set.suspects[i]} label="Suspect" />
                            <IconButton
                                class="material-icons"
                                onclick={() => {
                                    set.suspects.splice(i, 1);
                                    set.suspects = set.suspects;
                                }}>delete</IconButton
                            >
                            <br />
                        {/each}
                    </td>
                    <td>
                        <br />
                        {#each set.weapons, i}
                            <Textfield bind:value={set.weapons[i]} label="Weapon" />
                            <IconButton
                                class="material-icons"
                                onclick={() => {
                                    set.weapons.splice(i, 1);
                                    set.weapons = set.weapons;
                                }}>delete</IconButton
                            >
                            <br />
                        {/each}
                    </td>
                    <td>
                        <br />
                        {#each set.rooms, i}
                            <Textfield bind:value={set.rooms[i]} label="Room" />
                            <IconButton
                                class="material-icons"
                                onclick={() => {
                                    set.rooms.splice(i, 1);
                                    set.rooms = set.rooms;
                                }}>delete</IconButton
                            >
                            <br />
                        {/each}
                    </td>
                </tr>
            </tbody>
        </table>
    </Content>
    <Actions>
        <!-- This doesn't need an event handler--dialog is automatically closed -->
        <Button>
            <Label>Cancel</Label>
            <Icon class="material-icons">delete_forever</Icon>
        </Button>
        <Button variant="raised" onclick={saveSet} disabled={!setIsValid}>
            <Label>Save</Label>
            <Icon class="material-icons">save</Icon>
        </Button>
    </Actions>
</Dialog>
