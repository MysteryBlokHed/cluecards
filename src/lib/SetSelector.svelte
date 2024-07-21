<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Label, Icon } from '@smui/button';
    import Select, { Option } from '@smui/select';

    import SetManager from './SetManager.svelte';

    import SETS from '../sets';
    import { customSets, getSet, set } from '../stores';
    import { key } from '../ui';

    let setName = $set[0];
    $: $set = [setName, getSet(setName)];

    let creatorOpen = false;
    let removerOpen = false;
    $: console.log(creatorOpen);
</script>

<SetManager bind:creatorOpen bind:removerOpen />
<Panel>
    <Header>Set Selector</Header>
    <Content>
        <span>The version of the game being used.</span>
        <br />
        <Select {key} bind:value={setName}>
            <!-- Builtin sets -->
            {#each Object.keys(SETS) as name}
                <Option value={name}>{name}</Option>
            {/each}
            <!-- Custom sets -->
            {#each Object.keys($customSets) as name}
                <Option value={name}>{name}</Option>
            {/each}
        </Select>
        <br />

        <Button on:click={() => (creatorOpen = true)}>
            <Label>Create New Set</Label>
            <Icon class="material-icons">add</Icon>
        </Button>

        <Button on:click={() => (removerOpen = true)}>
            <Label>Select Set to Remove</Label>
            <Icon class="material-icons">delete</Icon>
        </Button>
    </Content>
</Panel>
