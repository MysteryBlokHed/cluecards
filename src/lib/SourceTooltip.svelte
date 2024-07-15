<script lang="ts">
    import Tooltip, { Wrapper } from '@smui/tooltip';
    export let text: string;
</script>

<Wrapper>
    <!-- prettier-ignore -->
    <span
    tabindex="0"
    role="button"
    style="font-size: 1em; user-select: none;"
    class="material-icons">help</span>

    <Tooltip unbounded>{text}</Tooltip>
</Wrapper>
