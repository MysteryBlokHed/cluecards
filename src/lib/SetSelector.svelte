<script lang="ts">
    import { compressToBase64 } from 'lz-string';
    import Button, { Label, Icon } from '@smui/button';
    import IconButton from '@smui/icon-button';
    import Select, { Option } from '@smui/select';
    import Tooltip, { Wrapper } from '@smui/tooltip';

    import SetManager from './SetManager.svelte';

    import SETS from '../sets';
    import { set, sets } from '../stores';

    let setName = $state($set[0]);
    $effect(() => {
        $set = [setName, $sets[setName]];
    });

    let creatorOpen = $state(false);
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

<SetManager bind:creatorOpen bind:updating />
<div>
    <h2>Set Selector</h2>
    <span>The version of the game being used.</span>
    <br />
    <Select bind:value={setName} menu$class="set-menu">
        {#each Object.keys($sets) as name}
            <Option value={name}>{name}</Option>
        {/each}
    </Select>
    <IconButton
        class="material-icons"
        onclick={() => {
            updating = setName;
            creatorOpen = true;
        }}>edit</IconButton
    >
    <Wrapper>
        <IconButton
            class="material-icons"
            onclick={() => {
                navigator.clipboard.writeText(compressToBase64(JSON.stringify($set)));
            }}>content_copy</IconButton
        >
        <Tooltip>Export this set to a shareable string.</Tooltip>
    </Wrapper>
    <IconButton class="material-icons" onclick={deleteSet}>delete</IconButton>
    <br />

    <Button
        onclick={() => {
            updating = null;
            creatorOpen = true;
        }}
    >
        <Label>Create New Set</Label>
        <Icon class="material-icons">add</Icon>
    </Button>
    <Wrapper>
        <Button onclick={restore}>
            <Label>Reload Builtin Sets</Label>
            <Icon class="material-icons">restart_alt</Icon>
        </Button>
        <Tooltip>Restore the builtin sets to their default values.</Tooltip>
    </Wrapper>
</div>
