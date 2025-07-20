import { beforeEach, describe, it } from "@std/testing/bdd";
import { BoolFlag, Flag, StringFlag } from "./flag.ts";
import { assertStrictEquals, assertThrows } from "@std/assert";
import { validateFlags } from "./mod.ts";

describe("Flag", () => {
  let fakeEnv: Map<string, string | undefined>;

  beforeEach(() => {
    fakeEnv = new Map();
    Flag.getEnvVar = (key: string) => fakeEnv.get(key);
  });

  it("required flag throws error if missing", () => {
    const flag = new StringFlag("FOO");
    assertThrows(
      () => flag.get(),
      Error,
      "Required flag is missing from env: FOO",
    );
  });

  it("optional flag returns default value if missing", () => {
    const flag = new StringFlag("FOO", "bar");
    assertStrictEquals(flag.get(), "bar");
  });

  it("BoolFlag can return true", () => {
    const flag = new BoolFlag("FOO");
    fakeEnv.set("FOO", "true");
    assertStrictEquals(flag.get(), true);
  });

  it("BoolFlag can return false", () => {
    const flag = new BoolFlag("FOO");
    fakeEnv.set("FOO", "false");
    assertStrictEquals(flag.get(), false);
  });

  it("BoolFlag throws if flag value is invalid", () => {
    const flag = new BoolFlag("FOO");
    fakeEnv.set("FOO", "bar");
    assertThrows(
      () => flag.get(),
      Error,
      "Invalid boolean value [bar] for flag FOO",
    );
  });

  it("validateFlags throws error if a flag was missing", () => {
    new BoolFlag("FOO");
    new BoolFlag("BAR");
    assertThrows(
      () => validateFlags(),
      Error,
      "Required flag is missing from env: FOO",
    );
  });

  it("can override value for testing before env is accessed", () => {
    Flag.getEnvVar = () => {
      throw new Error("env should not be accessed");
    };
    const flag = new StringFlag("FOO");
    flag.setValueForTest("overridden");
    assertStrictEquals(flag.get(), "overridden");
  });
});
