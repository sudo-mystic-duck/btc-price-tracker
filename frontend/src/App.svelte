<script lang="ts">
    import { fade } from "svelte/transition";
    import { fetchNewPrice, fetchAllPrices } from "./lib/api";
    import type { PriceRecord } from "./lib/types";
    import { formatPrice, formatTime } from "./lib/format";
    import PriceChart from "./lib/PriceChart.svelte";
    import ThemeToggle from "./lib/ThemeToggle.svelte";
    import { getStoredTheme, type Theme } from "./lib/theme";

    let data = $state<PriceRecord | null>(null);
    let history = $state<PriceRecord[]>([]);
    let error = $state<string | null>(null);
    let loading = $state(true);
    let theme = $state<Theme>(getStoredTheme());

    async function refresh(): Promise<void> {
        try {
            const latest = await fetchNewPrice();
            data = latest;
            error = null;
        } catch (e: unknown) {
            error =
                e instanceof Error ? e.message : "Failed to fetch BTC price.";
        } finally {
            loading = false;
        }
    }

    async function loadHistory(): Promise<void> {
        try {
            history = await fetchAllPrices();
        } catch {
            // keep previous history on transient failure
        }
    }

    async function refreshAll(): Promise<void> {
        await Promise.all([refresh(), loadHistory()]);
    }

    $effect(() => {
        refreshAll();
        const interval = setInterval(refreshAll, 30_000);
        return () => clearInterval(interval);
    });
</script>

<div class="min-h-screen flex flex-col">
    <div class="navbar bg-base-100 border-b border-base-300 shadow-sm px-4 lg:px-8">
        <div class="navbar-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center">
                <img
                    src="/bitcoin.png"
                    alt="Bitcoin"
                    class="h-full w-full object-contain"
                />
            </div>
            <p class="font-bold text-lg leading-tight">Bitcoin Tracker</p>
        </div>
        <div class="navbar-end">
            <ThemeToggle bind:theme />
        </div>
    </div>

    <main class="flex-1 container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
        {#if error}
            <div
                class="alert alert-error shadow-lg mb-6"
                role="alert"
                in:fade
            >
                <span>{error}</span>
            </div>
        {/if}

        {#if loading && !data}
            <div class="flex flex-col items-center justify-center gap-4 py-24">
                <span class="loading loading-spinner loading-lg text-primary"
                ></span>
                <p class="text-base-content/60">Fetching latest price…</p>
            </div>
        {:else if data}
            <div class="card bg-base-100 shadow-xl border border-base-300">
                <div class="card-body gap-6">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <div class="badge badge-primary badge-outline">
                                {data.base}/{data.currency}
                            </div>
                            <p class="text-sm text-base-content/50 mt-2">
                                Spot via Coinbase · stored locally
                            </p>
                        </div>
                        <div class="text-right text-sm text-base-content/50">
                            <p>Last update</p>
                            <p class="font-mono">
                                {formatTime(data.timestamp)}
                            </p>
                        </div>
                    </div>

                    {#key data.price}
                        <div class="text-center py-2" in:fade>
                            <p
                                class="text-4xl sm:text-5xl font-bold text-primary tracking-tight"
                            >
                                {formatPrice(data.price, data.currency)}
                            </p>
                        </div>
                    {/key}

                    <div class="divider my-0">Price history</div>

                    <PriceChart prices={history} />

                    {#if history.length > 0}
                        <div class="overflow-x-auto rounded-box border border-base-300">
                            <table class="table table-zebra table-sm">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th class="text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#each history.slice(0, 10) as row (row.id)}
                                        <tr>
                                            <td class="font-mono text-xs">
                                                {formatTime(row.timestamp)}
                                            </td>
                                            <td class="text-right font-medium">
                                                {formatPrice(
                                                    row.price,
                                                    row.currency,
                                                )}
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div class="hero py-16">
                <div class="hero-content text-center">
                    <div class="max-w-md">
                        <h2 class="text-2xl font-bold">No price data yet</h2>
                        <p class="py-4 text-base-content/60">
                            Start the backend with <code
                                class="kbd kbd-sm">bun dev</code
                            >
                            in the <code class="kbd kbd-sm">backend</code> folder.
                        </p>
                    </div>
                </div>
            </div>
        {/if}
    </main>

    <footer
        class="footer footer-center bg-base-100 border-t border-base-300 text-base-content/70 p-6 text-sm"
    >
        <nav class="flex flex-wrap justify-center gap-x-3 gap-y-1">
            <a
                class="link link-hover"
                href="https://github.com/sudo-mystic-duck/btc-price-tracker"
                >GitHub</a
            >
            <span>·</span>
            <span>sudo-mystic-duck</span>
            <span>·</span>
            <a
                class="link link-hover"
                href="https://api.coinbase.com/v2/prices/BTC-USD/spot"
                >Coinbase API</a
            >
            <span>·</span>
            <a
                class="link link-hover"
                href="https://www.flaticon.com/authors/freepik"
                >Icon by Freepik</a
            >
        </nav>
    </footer>
</div>
