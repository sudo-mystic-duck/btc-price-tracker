import type { Data } from "./types";

export function buildChartPoints(
    prices: Data[],
    width = 400,
    height = 120,
    padding = 8,
): string {
    if (prices.length < 2) return "";

    const chronological = [...prices].reverse();
    const values = chronological.map((p) => p.price);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return chronological
        .map((p, i) => {
            const x =
                padding +
                (i / (chronological.length - 1)) * (width - padding * 2);
            const y =
                height -
                padding -
                ((p.price - min) / range) * (height - padding * 2);
            return `${x},${y}`;
        })
        .join(" ");
}

export function getPriceRange(prices: Data[]): { min: number; max: number } | null {
    if (prices.length === 0) return null;
    const values = prices.map((p) => p.price);
    return { min: Math.min(...values), max: Math.max(...values) };
}
