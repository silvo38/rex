#!/usr/bin/env -S deno run --allow-read --allow-write
import { generate, glob } from "jsr:@silvo38/ningen@^0.1.0";

import { esbuild, tailwind } from "../src/build_defs.ts";
// Replace relative import with JSR import:
// import { tailwind } from "jsr:@silvo38/rex@^0.0.3/build_defs.ts";

esbuild({
  srcs: "client/app.tsx",
  out: ["dist/app.js"],
  deps: glob("client/**"),
});

tailwind({
  srcs: "static/styles.css",
  out: "static/styles.gen.css",
});

generate();
