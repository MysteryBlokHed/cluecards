<script lang="ts">
    import Tooltip, { Wrapper } from '@smui/tooltip';

    export interface Props {
        text: string;
        style?: string | undefined;
    }

    let { text, style = '' }: Props = $props();
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
