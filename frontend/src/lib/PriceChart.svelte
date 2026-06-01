<script lang="ts">
    import type { Data } from "./types";
    import { buildChartPoints, getPriceRange } from "./chart";

    interface Props {
        prices: Data[];
    }

    let { prices }: Props = $props();

    const width = 400;
    const height = 120;

    let points = $derived(buildChartPoints(prices, width, height));
    let minMax = $derived(getPriceRange(prices));
</script>

{#if prices.length < 2}
    <p class="text-sm text-base-content/50 text-center py-4">
        Collecting history… chart appears after 2 samples.
    </p>
{:else}
    <div class="w-full">
        <svg
            class="w-full h-auto text-primary"
            viewBox="0 0 {width} {height}"
            role="img"
            aria-label="Bitcoin price history chart"
        >
            <polyline
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                points={points}
            />
        </svg>
        {#if minMax}
            <div
                class="flex justify-between text-xs text-base-content/50 mt-1 px-1"
            >
                <span>Low {minMax.min.toLocaleString()}</span>
                <span>High {minMax.max.toLocaleString()}</span>
            </div>
        {/if}
    </div>
{/if}
