#!/usr/bin/env -S deno run --allow-read --allow-write
import { generate, glob } from "jsr:@silvo38/ningen@^0.1.0";

import { bundle, protobuf, rpcService, tailwind } from "rex/build_defs.ts";

bundle({
  srcs: "client/app.ts",
  out: ["dist/app.js"],
  deps: glob(["client/**", "gen/**"]),
});

tailwind({
  srcs: "static/styles.css",
  out: "dist/styles.css",
});

protobuf({
  srcs: "protos/simple.proto",
  out: "protos/simple.ts",
});

rpcService({
  src: "greeting_service.json",
  client: "gen/greeting_service_client.ts",
  service: "gen/greeting_service.ts",
});

generate();
