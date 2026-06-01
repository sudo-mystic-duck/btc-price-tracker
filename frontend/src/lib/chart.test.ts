import { describe, expect, test } from "bun:test";
import { buildChartPoints, getPriceRange } from "./chart";
import type { Data } from "./types";

function row(id: number, price: number): Data {
  return {
    id,
    base: "BTC",
    price,
    currency: "USD",
    timestamp: "2024-01-01T00:00:00Z",
  };
}

describe("buildChartPoints", () => {
  test("returns empty string for fewer than 2 points", () => {
    expect(buildChartPoints([])).toBe("");
    expect(buildChartPoints([row(1, 100)])).toBe("");
  });

  test("returns polyline points for two prices", () => {
    const points = buildChartPoints([row(2, 200), row(1, 100)]);
    expect(points.split(" ").length).toBe(2);
    expect(points).toContain(",");
  });

  test("handles flat prices (zero range)", () => {
    const points = buildChartPoints([row(2, 100), row(1, 100)]);
    expect(points.length).toBeGreaterThan(0);
  });

  test("orders chronologically left to right", () => {
    const points = buildChartPoints([row(3, 300), row(2, 200), row(1, 100)]);
    const firstX = Number.parseFloat(points.split(" ")[0]?.split(",")[0] ?? "0");
    const lastX = Number.parseFloat(
      points.split(" ").at(-1)?.split(",")[0] ?? "0",
    );
    expect(lastX).toBeGreaterThan(firstX);
  });
});

describe("getPriceRange", () => {
  test("returns null for empty input", () => {
    expect(getPriceRange([])).toBeNull();
  });

  test("returns min and max", () => {
    expect(getPriceRange([row(1, 50), row(2, 150)])).toEqual({
      min: 50,
      max: 150,
    });
  });
});
