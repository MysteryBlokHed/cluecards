<script lang="ts">
    import Button, { Label, Icon } from '@smui/button';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import IconButton from '@smui/icon-button';
    import List, { Item } from '@smui/list';
    import Textfield from '@smui/textfield';

    import { get } from 'svelte/store';

    import { set as activeSet, sets } from '../stores';
    import type { GameSet } from '../types';

    export let creatorOpen = false;
    export let updating: string | null = null;
    let setName: string = '';
    let set: GameSet;

    $: if (updating != null) {
        setName = updating;
        set = structuredClone(get(sets)[setName]);
    } else {
        resetSet();
        setName = '';
    }

    let setIsValid = false;

    $: {
        setIsValid = false;
        // Ensure at least 2 of each category
        if (set.suspects.length < 2 || set.weapons.length < 2 || set.rooms.length < 2) {
            break $;
        }
        // Ensure everything has a value
        if (
            set.suspects.some(val => !val) ||
            set.weapons.some(val => !val) ||
            set.rooms.some(val => !val)
        ) {
            break $;
        }
        // Ensure values are unique
        const suspectSet = new Set(set.suspects.map(val => val.trim()));
        const weaponSet = new Set(set.weapons.map(val => val.trim()));
        const roomSet = new Set(set.rooms.map(val => val.trim()));
        if (
            suspectSet.size !== set.suspects.length ||
            weaponSet.size !== set.weapons.length ||
            roomSet.size !== set.rooms.length
        ) {
            break $;
        }

        setIsValid = true;
    }

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
        <Textfield bind:value={setName} label="Set Name" disabled={updating != null} />
        <table>
            <tbody>
                <tr>
                    <td>
                        <Button on:click={() => (set.suspects = [...set.suspects, ''])}>
                            <Label>Add Suspect</Label>
                            <Icon class="material-icons">add</Icon>
                        </Button>
                    </td>
                    <td>
                        <Button on:click={() => (set.weapons = [...set.weapons, ''])}>
                            <Label>Add Weapon</Label>
                            <Icon class="material-icons">add</Icon>
                        </Button>
                    </td>
                    <td>
                        <Button on:click={() => (set.rooms = [...set.rooms, ''])}>
                            <Label>Add Room</Label>
                            <Icon class="material-icons">add</Icon>
                        </Button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        {#each set.suspects as suspect, i}
                            <Textfield bind:value={suspect} label="Suspect" />
                            <IconButton
                                class="material-icons"
                                on:click={() => {
                                    set.suspects.splice(i, 1);
                                    set.suspects = set.suspects;
                                }}>delete</IconButton
                            >
                            <br />
                        {/each}
                    </td>
                    <td>
                        <br />
                        {#each set.weapons as weapon, i}
                            <Textfield bind:value={weapon} label="Weapon" />
                            <IconButton
                                class="material-icons"
                                on:click={() => {
                                    set.weapons.splice(i, 1);
                                    set.weapons = set.weapons;
                                }}>delete</IconButton
                            >
                            <br />
                        {/each}
                    </td>
                    <td>
                        <br />
                        {#each set.rooms as room, i}
                            <Textfield bind:value={room} label="Room" />
                            <IconButton
                                class="material-icons"
                                on:click={() => {
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
        <Button variant="raised" on:click={saveSet} disabled={!setIsValid}>
            <Label>Save</Label>
            <Icon class="material-icons">save</Icon>
        </Button>
    </Actions>
</Dialog>
