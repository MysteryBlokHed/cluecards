<script lang="ts">
    import Paper from '@smui/paper';
    import Select, { Option } from '@smui/select';
    import Tooltip, { Wrapper } from '@smui/tooltip';

    import { players, preferences, playerPov } from '../../stores';
    import { CardType } from '../../types';

    import ClueList from './ClueList.svelte';
</script>

<Paper style="display: table;">
    <h2>Clues</h2>

    {#if $preferences.firstIsSelf}
        <div>
            <Wrapper>
                <Select bind:value={$playerPov} label="Preview clue sheet of...">
                    {#each $players as player, i}
                        <Option value={i}>{player}</Option>
                    {/each}
                </Select>
                <Tooltip>
                    Applies the same inference logic from the perspective of another player to see
                    what they might know.
                </Tooltip>
            </Wrapper>
        </div>
    {/if}

    <ClueList type={CardType.Suspect} />
    <ClueList type={CardType.Weapon} />
    <ClueList type={CardType.Room} />
</Paper>
