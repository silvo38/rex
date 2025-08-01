#!/usr/bin/env -S deno run --allow-read --allow-write
import { generate, glob } from "jsr:@silvo38/ningen@^0.1.0";

import { bundle, protobuf, tailwind } from "rex/build_defs.ts";

bundle({
  srcs: "client/app.ts",
  out: ["dist/app.js"],
  deps: glob("client/**"),
});

tailwind({
  srcs: "static/styles.css",
  out: "static/styles.gen.css",
});

protobuf({
  srcs: "protos/simple.proto",
  out: "protos/simple.ts",
});

generate();
