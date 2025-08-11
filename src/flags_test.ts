import { beforeEach, describe, it } from "@std/testing/bdd";
import { Flag } from "./flag.ts";
import { assertStrictEquals } from "@std/assert/strict-equals";
import * as flags from "./flags.ts";

describe("Built-in flags", () => {
  let fakeEnv: Map<string, string | undefined>;

  beforeEach(() => {
    fakeEnv = new Map();
    Flag.getEnvVar = (key: string) => fakeEnv.get(key);

    flags.isDev.resetForTest();
    flags.port.resetForTest();
    flags.cacheAssets.resetForTest();
  });

  it("dev defaults", () => {
    fakeEnv.set("REX_DEV", "true");
    assertStrictEquals(flags.isDev.get(), true);
    assertStrictEquals(flags.port.get(), 8000);
    assertStrictEquals(flags.cacheAssets.get(), false);
  });

  it("prod defaults", () => {
    assertStrictEquals(flags.isDev.get(), false);
    assertStrictEquals(flags.port.get(), 8000);
    assertStrictEquals(flags.cacheAssets.get(), true);
  });
});
