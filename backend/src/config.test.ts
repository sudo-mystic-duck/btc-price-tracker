import { describe, expect, test } from "bun:test";
import { config, envInt } from "./config";

describe("config", () => {
  test("uses positive defaults", () => {
    expect(config.port).toBeGreaterThan(0);
    expect(config.pollIntervalMs).toBeGreaterThan(0);
    expect(config.dbPath.length).toBeGreaterThan(0);
    expect(config.corsOrigin.length).toBeGreaterThan(0);
  });
});

describe("envInt", () => {
  test("returns fallback when unset", () => {
    expect(envInt("__MISSING__", 42)).toBe(42);
  });

  test("returns fallback when not a number", () => {
    const key = "TEST_ENV_INT_BAD_" + Date.now();
    process.env[key] = "abc";
    expect(envInt(key, 99)).toBe(99);
    delete process.env[key];
  });

  test("parses valid integer string", () => {
    const key = "TEST_ENV_INT_" + Date.now();
    process.env[key] = "8080";
    expect(envInt(key, 3000)).toBe(8080);
    delete process.env[key];
  });

  test("returns fallback for empty string", () => {
    const key = "TEST_ENV_INT_EMPTY_" + Date.now();
    process.env[key] = "";
    expect(envInt(key, 3000)).toBe(3000);
    delete process.env[key];
  });
});
