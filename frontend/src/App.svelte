<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import { fetchNewPrice } from "./lib/api";

    let data: any = null;
    let isDark = true;
    let interval: number;

    onMount(async () => {
        // System-Check
        isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Listener für Echtzeit-Wechsel des Systems
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", (e) => (isDark = e.matches));

        data = await fetchNewPrice();
        interval = setInterval(
            async () => (data = await fetchNewPrice()),
            30000,
        );
    });

    onDestroy(() => clearInterval(interval));
</script>

<div class="app" class:light={!isDark}>
    <header>
        <div class="brand">
            <img src="/bitcoin.png" alt="B" /> Bitcoin Tracker
        </div>
        <button on:click={() => (isDark = !isDark)}
            >{isDark ? "🌙" : "☀️"}</button
        >
    </header>

    <main>
        {#if data}
            <div class="card glow" in:fade>
                <p>{data.base}/{data.currency}</p>
                {#key data.price}<h1 in:fade>{data.price}</h1>{/key}
                <small
                    >Update: {new Date(
                        data.timestamp,
                    ).toLocaleTimeString()}</small
                >
            </div>
        {:else}
            <p>Loading...</p>
        {/if}
    </main>

    <footer>
        <a href="https://github.com/sudo-mystic-duck/btc-price-tracker"
            >GitHub</a
        >
        •
        <span>Developed by sudo-mystic-duck</span> •
        <a href="https://api.coinbase.com/v2/prices/BTC-USD/spot"
            >CoinBase API</a
        >
        •
        <a href="https://www.flaticon.com/authors/freepik">Icon by Freepik</a>
    </footer>
</div>
