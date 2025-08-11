import { beforeEach, describe, it } from "@std/testing/bdd";
import { BoolFlag, Flag, IntFlag, StringFlag } from "./flag.ts";
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

  describe("BoolFlag", () => {
    it("can return true", () => {
      const flag = new BoolFlag("FOO");
      fakeEnv.set("FOO", "true");
      assertStrictEquals(flag.get(), true);
    });

    it("can return false", () => {
      const flag = new BoolFlag("FOO");
      fakeEnv.set("FOO", "false");
      assertStrictEquals(flag.get(), false);
    });

    it("throws if flag value is invalid", () => {
      const flag = new BoolFlag("FOO");
      fakeEnv.set("FOO", "bar");
      assertThrows(
        () => flag.get(),
        Error,
        "Invalid boolean value [bar] for flag FOO",
      );
    });
  });

  describe("IntFlag", () => {
    it("can return positive int", () => {
      const flag = new IntFlag("FOO");
      fakeEnv.set("FOO", "123");
      assertStrictEquals(flag.get(), 123);
    });

    it("can return negative int", () => {
      const flag = new IntFlag("FOO");
      fakeEnv.set("FOO", "-123");
      assertStrictEquals(flag.get(), -123);
    });

    it("throws if flag value is invalid", () => {
      const flag = new IntFlag("FOO");
      fakeEnv.set("FOO", "bar");
      assertThrows(
        () => flag.get(),
        Error,
        "Invalid int value [bar] for flag FOO",
      );
    });

    it("throws if number is floating point", () => {
      const flag = new IntFlag("FOO");
      fakeEnv.set("FOO", "12.34");
      assertThrows(
        () => flag.get(),
        Error,
        "Invalid int value [12.34] for flag FOO",
      );
    });
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
