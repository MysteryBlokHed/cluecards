<script lang="ts">
    import { players, preferences, playerPov } from '../../stores';
    import { CardType } from '../../types';

    import ClueList from './ClueList.svelte';
</script>

<div class="card bg-base-100 shadow-xl" style="display: table;">
    <div class="card-body p-5">
        <h2 class="card-title justify-center text-2xl">Clues</h2>

        {#if $preferences.firstIsSelf}
            <div>
                <div
                    class="tooltip tooltip-right w-fit"
                    data-tip="Applies the same inference logic from the perspective of another player to see what they might know."
                >
                    <div>
                        <span class="m-0 text-xs">Preview clue sheet of...</span>
                        <br />
                        <select
                            bind:value={$playerPov}
                            class="select select-bordered m-0"
                            placeholder="Preview clue sheet of..."
                        >
                            {#each $players as player, i}
                                <option value={i}>{player}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        {/if}

        <ClueList type={CardType.Suspect} />
        <ClueList type={CardType.Weapon} />
        <ClueList type={CardType.Room} />
    </div>
</div>
