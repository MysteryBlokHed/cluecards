<script lang="ts">
    import Tooltip, { Wrapper } from '@smui/tooltip';
    export let plural = false;
</script>

<Wrapper>
    <!-- prettier-ignore -->
    <span
    tabindex="0"
    role="button"
    style="font-size: 1em; user-select: none;"
    class="material-icons">help</span>

    <Tooltip unbounded>
        {#if plural}
            These cards were inferred. It is not known exactly which one was shown.
        {:else}
            This card was inferred.
        {/if}
    </Tooltip>
</Wrapper>
