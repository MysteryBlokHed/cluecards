<script lang="ts">
    export interface Props {
        i: number;
        placeholder: string;
        set: unknown[];
    }

    let { i, placeholder, set }: Props = $props();
</script>

<div class="flex">
    <input type="text" class="input input-bordered" bind:value={set[i]} {placeholder} />
    <button class="btn btn-circle btn-ghost" onclick={() => set.splice(i, 1)}>
        <span class="material-icons">delete</span>
    </button>
    <br />
</div>
