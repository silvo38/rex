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
  pool: "console",
  // Any .tsx file could pull in a new class from Tailwind, which would require
  // CSS to be regenerated.
  deps: glob("**/*.tsx"),
});

/** Ningen build rule for bundling client JS using Deno. */
export const bundle: BuildFn = rule({
  name: "bundle",
  cmd: "deno bundle --platform=browser --sourcemap=external --output=$out $in",
  desc: "Deno bundle",
  pool: "console",
});

export const protobuf: BuildFn = rule({
  name: "protobuf",
  cmd:
    "protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=. $in",
  desc: "Generating protobuf",
});

const rpcGeneratorRule = rule({
  name: "rpcgen",
  cmd: "deno run --allow-read --allow-write rex/tools/rpc_generator.ts " +
    "--config=$in --client-out=$client --service-out=$service",
  desc: "Generating RPC service",
});

/**
 * Ningen build rule for generating an RPC service.
 *
 * `src` is the `.json` config file containing the service specification.
 * `client` is the path to the generated `.ts` client, and `service` to the
 * generated service (used in the server).
 */
export function rpcService(
  { src, client, service }: {
    src: string;
    client: string;
    service: string;
  },
) {
  rpcGeneratorRule({
    srcs: src,
    out: [client, service],
    vars: { client, service },
  });
}

// TODO: Add rule for calling `deno check`.
