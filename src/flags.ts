import { BoolFlag, StringFlag } from "./flag.ts";
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

/**
 * A version number string to use for all assets. Using the default randomly-
 * generated string is probably fine. This will give you a new version everytime
 * the server is restarted, which is less than optimal but probably fine.
 * Otherwise, feel free to set the REX_ASSET_VERSION env variable yourself, but
 * remember to change it each time you update your server or assets.
 *
 * Only used when REX_CACHE_ASSETS is enabled.
 */
export const assetVersion: StringFlag = new StringFlag(
  "REX_ASSET_VERSION",
  () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const array = new Uint8Array(10);
    crypto.getRandomValues(array);
    let result = "";
    for (const byte of array) {
      result += alphabet[byte % alphabet.length];
    }
    return result;
  },
);
