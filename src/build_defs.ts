/**
 * Ningen build defs file, providing helper functions for running the Tailwind
 * compiler on your CSS. Import from your BUILD.ts file.
 */
import { type BuildFn, glob, rule } from "jsr:@silvo38/ningen@^0.1.0";

/** Ningen build rule for invoking the Tailwind compiler on a CSS file. */
export const tailwind: BuildFn = rule({
  name: "tailwind",
  cmd: "deno run -A npm:@tailwindcss/cli@^4.1.7 --input $in --output $out",
  desc: "Generating Tailwind CSS",
  // Any .tsx file could pull in a new class from Tailwind, which would require
  // CSS to be regenerated.
  deps: glob("**/*.tsx"),
});

/**
 * Ningen build rule for invoking the esbuild bundler. Use `srcs` for your
 * entrypoint script, and `out` for your output JS file. A `.map` sourcemap file
 * will also be generated.
 */
export const esbuild: BuildFn = rule({
  name: "esbuild",
  cmd:
    "deno run -A npm:esbuild --bundle --sourcemap --jsx-factory=h --jsx-fragment=Fragment --metafile=$out.meta.json $in --outfile=$out",
  desc: "Bundling JS with esbuild",
});
