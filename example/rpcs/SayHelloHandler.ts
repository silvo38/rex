import { SayHelloBase } from "../gen/greeting_service.ts";
import { HelloRequest, HelloResponse } from "../schema.ts";

// Example of how to implement an RPC.
// RPC was defined in `greeting_service.json`.
export class SayHelloHandler extends SayHelloBase {
  override rpc(request: HelloRequest): HelloResponse {
    return {
      message: `Hello, ${request.name}`,
    };
  }
}
