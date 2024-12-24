<script lang="ts">
    import AddCards from './AddCards.svelte';
    import Players from './Players.svelte';
    import Preferences from './Preferences.svelte';
    import RestartGame from './RestartGame.svelte';
    import SetSelector from './SetSelector.svelte';

    const tabs = ['Set Selector', 'Players', 'Add Cards', 'Preferences', 'Restart'] as const;
    let activeTab: string = $state('Set Selector');

    function setTab(tab: string) {
        activeTab = tab;
    }
</script>

<div role="tablist" class="group tabs tabs-bordered">
    {#each tabs as tab}
        <input
            bind:group={activeTab}
            type="radio"
            role="tab"
            class="tab pb-8 text-lg checked:[--fallback-bc:theme(colors.primary)]"
            name="app_tabs"
            value={tab}
            aria-label={tab}
        />
    {/each}
</div>

<div class="card rounded-t-none bg-base-100 shadow-xl">
    {#if activeTab === 'Set Selector'}
        <SetSelector />
    {:else if activeTab === 'Players'}
        <Players />
    {:else if activeTab === 'Add Cards'}
        <AddCards />
    {:else if activeTab === 'Preferences'}
        <Preferences />
    {:else if activeTab === 'Restart'}
        <RestartGame {setTab} />
    {/if}
</div>
