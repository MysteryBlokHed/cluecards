<script lang="ts">
    export interface Props {
        text: string;
        style?: string | undefined;
    }

    let { text, style = '' }: Props = $props();
</script>

<div class="tooltip" data-tip={text}>
    <!-- prettier-ignore -->
    <span
    tabindex="0"
    role="button"
    style="font-size: 1em; user-select: none; {style}"
    class="material-icons">help</span>
</div>
