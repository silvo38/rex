/** All flags which have not been validated yet. */
const unvalidatedFlags: Flag<unknown>[] = [];

/** A flag, whose value is supplied by env. */
export abstract class Flag<T> {
  /** For testing only. Don't set or call this yourself. */
  static getEnvVar = Deno.env.get;

  /** The value of the flag, or undefined if it has not been set yet. */
  private value?: T;

  constructor(
    /** The name of the env variable. */
    protected readonly name: string,
    /**
     * An optional default value for the flag. If not provided, the flag is
     * required. You can also supply a function which will return the default
     * value.
     */
    protected readonly defaultValue?: T | (() => T),
  ) {
    unvalidatedFlags.push(this);
  }

  /** Returns the value of the flag. */
  get(): T {
    if (this.value !== undefined) {
      return this.value;
    }
    this.value = this.computeValue();
    return this.value;
  }

  /** For use in tests only. Overrides the value of the flag. */
  setValueForTest(value: T) {
    this.value = value;
  }

  /**
   * For use in tests only. Resets the stored value so that it can be computed
   * again.
   */
  resetForTest() {
    this.value = undefined;
  }

  private computeValue(): T {
    const rawValue = Flag.getEnvVar(this.name);
    if (rawValue === undefined) {
      if (this.defaultValue !== undefined) {
        if (typeof this.defaultValue === "function") {
          return (this.defaultValue as (() => T))();
        } else {
          return this.defaultValue;
        }
      } else {
        throw new Error(`Required flag is missing from env: ${this.name}`);
      }
    } else {
      return this.parse(rawValue);
    }
  }

  /** Parses the value from the given string. */
  protected abstract parse(rawValue: string): T;
}

/** A boolean flag. */
export class BoolFlag extends Flag<boolean> {
  protected override parse(rawValue: string): boolean {
    switch (rawValue) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        throw new Error(
          `Invalid boolean value [${rawValue}] for flag ${this.name}`,
        );
    }
  }
}

/** A string flag. */
export class StringFlag extends Flag<string> {
  protected override parse(rawValue: string): string {
    return rawValue;
  }
}

/** An int flag. */
export class IntFlag extends Flag<number> {
  protected override parse(rawValue: string): number {
    const value = Number(rawValue);
    if (Number.isNaN(value) || !Number.isInteger(value)) {
      throw new Error(`Invalid int value [${rawValue}] for flag ${this.name}`);
    }
    return value;
  }
}

/**
 * Eagerly validates all flags, by running the `get` method.
 *
 * This will be called by the Server class automatically, you don't have to call
 * it yourself.
 *
 * This ensures that missing/invalid flag errors are found when the server is
 * first started, so that you don't get crashes later on when handlers get run.
 */
export function validateFlags() {
  for (const flag of unvalidatedFlags) {
    flag.get();
  }
  unvalidatedFlags.length = 0;
}
