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
    let removerOpen = false;
    let updating: string | null = null;
</script>

<SetManager bind:creatorOpen bind:removerOpen bind:updating />
<Panel>
    <Header>Set Selector</Header>
    <Content>
        <span>The version of the game being used.</span>
        <br />
        <Select bind:value={setName}>
            <!-- Builtin sets -->
            <!-- {#each Object.keys(SETS) as name}
                <Option value={name}>{name}</Option>
            {/each} -->
            <!-- Custom sets -->
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
        <IconButton class="material-icons" on:click={() => (removerOpen = true)}>delete</IconButton>
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
