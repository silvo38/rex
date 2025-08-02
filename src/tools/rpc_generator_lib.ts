import { getRpcRoute } from "@silvo38/rex";

export interface ServiceConfig {
  /** The name of the service. */
  service: string;

  /**
   * Files that need to be imported. Maps from file path to a list of all types
   * to import from that file. e.g.:
   *
   * ```
   * "importMap": {
   *   "./schema.ts": ["MyRequest", "MyResponse"]
   * }
   * ```
   */
  importMap: Record<string, string[]>;

  /** Config for each RPC in the service. */
  rpcs: RpcConfig[];
}

interface RpcConfig {
  name: string;
  method: "GET" | "POST";
  request: string;
  response: string;
}

function importTypes(config: ServiceConfig, output: (line: string) => void) {
  for (const [path, typeNames] of Object.entries(config.importMap)) {
    output(`import type { ${typeNames.join(", ")} } from "${path}";`);
  }
}

/** Generates the .ts file for an RPC client. */
export function generateRpcClient(config: ServiceConfig): string {
  const lines: string[] = [];
  const output = (line: string) => {
    lines.push(line);
  };

  importTypes(config, output);
  output(`import { sendRpc } from "rex/client";`);
  output("");

  output(`/** RPC client for ${config.service}. */`);
  output(`export class ${config.service}Client {`);

  for (const rpc of config.rpcs) {
    output(
      `  ${rpc.name}(request: ${rpc.request}): Promise<${rpc.response}> {
    return sendRpc("${config.service}", "${rpc.name}", "${rpc.method}", request);
  }`,
    );
  }

  output(`}`);
  output("");
  return lines.join("\n");
}

export function generateRpcService(config: ServiceConfig): string {
  const lines: string[] = [];
  const output = (line: string) => {
    lines.push(line);
  };

  importTypes(config, output);
  output(`import { Method, RpcHandler } from "rex";`);
  output("");

  for (const rpc of config.rpcs) {
    output(`/** RPC handler for ${config.service}.${rpc.name}. */`);
    output(
      `export abstract class ${
        getHandlerClassName(rpc)
      } extends RpcHandler<${rpc.request}, ${rpc.response}> {`,
    );
    output(`  override route = "${getRpcRoute(config.service, rpc.name)}";`);
    output(`  override method = ${getMethod(rpc)}`);
    output("}");
  }

  output("");
  return lines.join("\n");
}

function getHandlerClassName(rpc: RpcConfig): string {
  return rpc.name[0].toUpperCase() + rpc.name.substring(1) + "Base";
}

function getMethod(rpc: RpcConfig): string {
  switch (rpc.method) {
    case "GET":
      return "Method.Get";
    case "POST":
      return "Method.Post";
    default:
      throw new Error(`Unsupported Method: ${rpc.method}`);
  }
}
