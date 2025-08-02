import type { Handler } from "./handler.ts";
import type { Method } from "./method.ts";
import { Responses } from "./response.ts";
import type { RexRequest } from "./request.ts";

/** Base class for an RPC handler. */
export abstract class RpcHandler<Req, Res> implements Handler {
  abstract route: string | URLPattern;
  abstract method?: Method | undefined;

  /**
   * Main RPC handler method. Subclasses should override this. Don't assume that
   * the request is well-formed, make sure you validate it!
   */
  abstract rpc(request: Req): Res | Promise<Res>;

  async handle(request: RexRequest): Promise<Response> {
    let json: Req;
    try {
      json = await request.json();
    } catch {
      return Responses.badRequest("Malformed JSON in request");
    }

    const response = await this.rpc(json);
    return Responses.json(response);
  }
}
