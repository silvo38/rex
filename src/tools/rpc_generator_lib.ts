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

/** Generates the .ts file for an RPC client. */
export function generateRpcClient(config: ServiceConfig): string {
  const lines: string[] = [];
  const output = (line: string) => {
    lines.push(line);
  };

  for (const [path, typeNames] of Object.entries(config.importMap)) {
    output(`import type { ${typeNames.join(", ")} } from "${path}";`);
  }
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

  return lines.join("\n");
}

export function generateRpcService(_config: ServiceConfig): string {
  return "TODO: Implement RPC Service generator";
}
