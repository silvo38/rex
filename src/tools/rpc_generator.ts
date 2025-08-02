import {
  generateRpcClient,
  generateRpcService,
  type ServiceConfig,
} from "./rpc_generator_lib.ts";
import { parseArgs } from "@std/cli/parse-args";

function printUsage() {
  console.error(`\
Usage:
    deno run --allow-read --allow-write rex/tools/rpc_generator.ts --config=config.json --client-out=client.ts --service-out=service.ts`);
}

const args = parseArgs(Deno.args, {
  string: ["client-out", "service-out", "config"],
});

if (!args["config"]) {
  console.error("--config is required");
  printUsage();
  Deno.exit(1);
}
if (!args["client-out"]) {
  console.error("--client-out is required");
  printUsage();
  Deno.exit(1);
}
if (!args["service-out"]) {
  console.error("--service-out is required");
  printUsage();
  Deno.exit(1);
}

const json = Deno.readTextFileSync(args["config"]);
const config = JSON.parse(json) as ServiceConfig;

Deno.writeTextFileSync(args["client-out"], generateRpcClient(config));
Deno.writeTextFileSync(args["service-out"], generateRpcService(config));
