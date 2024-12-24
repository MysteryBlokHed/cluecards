<script lang="ts">
    export interface Props {
        text: string;
        classes?: string | undefined;
    }

    let { text, classes = '' }: Props = $props();
</script>

<div class="tooltip" data-tip={text}>
    <!-- prettier-ignore -->
    <span
    tabindex="0"
    role="button"
    class="material-icons cursor-default text-[1em] select-none {classes}">help</span>
</div>
