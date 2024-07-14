<script lang="ts">
    import { Panel, Header, Content } from '@smui-extra/accordion';
    import Select, { Option } from '@smui/select';

    import SETS from '../sets';
    import { set } from '../stores';

    let setName: keyof typeof SETS = $set[0];
    $: $set = [setName, SETS[setName]];
</script>

<Panel>
    <Header>Set Selector</Header>
    <Content>
        <span>The version of the game being used.</span>
        <br />
        <Select bind:value={setName}>
            {#each Object.keys(SETS) as name}
                <Option value={name}>{name}</Option>
            {/each}
        </Select>
    </Content>
</Panel>
