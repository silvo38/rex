import { BoolFlag } from "./flag.ts";
import { IntFlag } from "@silvo38/rex";

// Built-in flag definitions. These all start with the prefix `REX_`.

/**
 * Whether this is a dev build. It's recommended to set this to true in your
 * `dev.env` file. Generally this flag should not be used directly; instead, it
 * is used to set the default value for *other* flags.
 */
export const isDev: BoolFlag = new BoolFlag("REX_DEV", false);

/** The port to listen on. Defaults to port 8000. */
export const port: IntFlag = new IntFlag("REX_PORT", 8000);

/** Whether to automatically cache assets. Enabled for non-dev by default. */
export const cacheAssets: BoolFlag = new BoolFlag(
  "REX_CACHE_ASSETS",
  () => !isDev.get(),
);
