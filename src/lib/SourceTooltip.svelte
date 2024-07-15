<script lang="ts">
    import Tooltip, { Wrapper } from '@smui/tooltip';
    export let text: string;
    export let style = '';
</script>

<Wrapper>
    <!-- prettier-ignore -->
    <span
    tabindex="0"
    role="button"
    style="font-size: 1em; user-select: none; {style}"
    class="material-icons">help</span>

    <Tooltip unbounded>{text}</Tooltip>
</Wrapper>
