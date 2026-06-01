<script lang="ts">
    import { applyTheme, isDarkTheme, setStoredTheme, type Theme } from "./theme";

    interface Props {
        theme?: Theme;
        onThemeChange?: (theme: Theme) => void;
    }

    let { theme = $bindable<Theme>("light"), onThemeChange }: Props = $props();

    let checked = $derived(isDarkTheme(theme));

    function onToggle(event: Event): void {
        const input = event.currentTarget as HTMLInputElement;
        const next: Theme = input.checked ? "dark" : "light";
        setStoredTheme(next);
        applyTheme(next);
        theme = next;
        onThemeChange?.(next);
    }
</script>

<label class="toggle text-base-content">
    <input
        type="checkbox"
        class="theme-controller"
        value="dark"
        {checked}
        aria-label="Toggle dark mode"
        onchange={onToggle}
    />

    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
        >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
        </g>
    </svg>

    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="currentColor"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </g>
    </svg>
</label>
