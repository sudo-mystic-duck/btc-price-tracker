import { beforeEach, describe, expect, test } from "bun:test";
import {
  applyTheme,
  getStoredTheme,
  initTheme,
  isDarkTheme,
  setStoredTheme,
} from "./theme";

const storage = new Map<string, string>();
let dataTheme = "light";

beforeEach(() => {
  storage.clear();
  dataTheme = "light";

  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  } as Storage;

  globalThis.document = {
    documentElement: {
      setAttribute: (_name: string, value: string) => {
        dataTheme = value;
      },
      getAttribute: () => dataTheme,
    },
  } as unknown as Document;
});

describe("theme", () => {
  test("isDarkTheme identifies dark", () => {
    expect(isDarkTheme("dark")).toBe(true);
    expect(isDarkTheme("light")).toBe(false);
  });

  test("setStoredTheme and getStoredTheme round-trip", () => {
    setStoredTheme("dark");
    expect(getStoredTheme()).toBe("dark");
    setStoredTheme("light");
    expect(getStoredTheme()).toBe("light");
  });

  test("getStoredTheme defaults to light for unknown values", () => {
    storage.set("btc-theme", "invalid");
    expect(getStoredTheme()).toBe("light");
  });

  test("applyTheme sets data-theme on document", () => {
    applyTheme("dark");
    expect(dataTheme).toBe("dark");
    applyTheme("light");
    expect(dataTheme).toBe("light");
  });

  test("initTheme applies stored theme", () => {
    setStoredTheme("dark");
    expect(initTheme()).toBe("dark");
    setStoredTheme("light");
  });
});
