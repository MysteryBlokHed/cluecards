<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Label, Icon } from '@smui/button';
    import Select, { Option } from '@smui/select';

    import SetManager from './SetManager.svelte';

    import SETS from '../sets';
    import { customSets, getSet, set } from '../stores';
    import IconButton from '@smui/icon-button';

    let setName = $set[0];
    $: $set = [setName, getSet(setName)];

    let creatorOpen = false;
    let updating: string | null = null;

    function deleteSet() {
        delete $customSets[setName];
        setName = Object.keys($customSets)[0];
        $set = [setName, getSet(setName)];
        $customSets = $customSets;
    }
</script>

<SetManager bind:creatorOpen bind:updating />
<Panel>
    <Header>Set Selector</Header>
    <Content>
        <span>The version of the game being used.</span>
        <br />
        <Select bind:value={setName}>
            {#each Object.keys($customSets) as name}
                <Option value={name}>{name}</Option>
            {/each}
        </Select>
        <IconButton
            class="material-icons"
            on:click={() => {
                updating = setName;
                creatorOpen = true;
            }}>edit</IconButton
        >
        <IconButton class="material-icons" on:click={deleteSet}>delete</IconButton>
        <br />

        <Button
            on:click={() => {
                updating = null;
                creatorOpen = true;
            }}
        >
            <Label>Create New Set</Label>
            <Icon class="material-icons">add</Icon>
        </Button>
    </Content>
</Panel>
