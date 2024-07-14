<script lang="ts">
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Icon, Label } from '@smui/button';
    import Paper from '@smui/paper';
    import IconButton from '@smui/icon-button';
    import Select, { Option } from '@smui/select';
    import Textfield from '@smui/textfield';

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
