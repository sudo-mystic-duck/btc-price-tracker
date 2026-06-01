import { describe, expect, test } from "bun:test";
import { formatPrice, formatTime } from "./format";

describe("formatPrice", () => {
  test("formats USD currency", () => {
    const formatted = formatPrice(42000.5, "USD");
    expect(formatted).toContain("42");
    expect(formatted).toContain("$");
  });

  test("handles zero", () => {
    expect(formatPrice(0, "USD")).toContain("0");
  });

  test("handles large numbers", () => {
    const formatted = formatPrice(1_000_000, "USD");
    expect(formatted).toContain("1");
  });
});

describe("formatTime", () => {
  test("formats valid ISO timestamp", () => {
    const result = formatTime("2024-01-15T12:30:00Z");
    expect(result.length).toBeGreaterThan(0);
  });

  test("returns Invalid Date string for bad input without throwing", () => {
    const result = formatTime("not-a-date");
    expect(result).toBe("Invalid Date");
  });
});
