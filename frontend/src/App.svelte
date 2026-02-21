<script lang="ts">
    import type { Data } from "./lib/types";
    import { onMount } from "svelte";
    import { fetchBtcPrice } from "./lib/api";

    let data: Data;

    onMount(async () => {
        data = await fetchBtcPrice();
    });
</script>

{#if data}
    <h1>{data.price}</h1>
    <h1>{data.currency}</h1>
    <h1>{data.timestamp}</h1>
    <h1>{data.id}</h1>
    <h1>{data.base}</h1>
{:else}
    <div>Loading...</div>
{/if}
