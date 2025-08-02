import {
  generateRpcClient,
  generateRpcService,
  type ServiceConfig,
} from "./rpc_generator_lib.ts";
import { assertStrictEquals } from "@std/assert";

const config: ServiceConfig = {
  "service": "GreetingService",
  "importMap": {
    "./schema.ts": ["HelloRequest", "HelloResponse"],
  },
  "rpcs": [
    {
      "name": "sayHello",
      "method": "GET",
      "request": "HelloRequest",
      "response": "HelloResponse",
    },
  ],
};

Deno.test("generateRpcClient works", () => {
  const expected = `\
import type { HelloRequest, HelloResponse } from "./schema.ts";
import { sendRpc } from "rex/client";

/** RPC client for GreetingService. */
export class GreetingServiceClient {
  sayHello(request: HelloRequest): Promise<HelloResponse> {
    return sendRpc("GreetingService", "sayHello", "GET", request);
  }
}
`;
  assertStrictEquals(generateRpcClient(config), expected);
});

Deno.test("generateRpcService works", () => {
  const expected = `\
import type { HelloRequest, HelloResponse } from "./schema.ts";
import { Method, RpcHandler } from "rex";

/** RPC handler for GreetingService.sayHello. */
export abstract class SayHelloBase extends RpcHandler<HelloRequest, HelloResponse> {
  override route = "/api/GreetingService.sayHello";
  override method = Method.Get
}
`;
  assertStrictEquals(generateRpcService(config), expected);
});
