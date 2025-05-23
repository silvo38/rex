import type { Method } from "./method.ts";
import type { RexRequest } from "./request.ts";

/** Handles a route, by returning a Response. Can be async. */
export type HandlerFn = (request: RexRequest) => Response | Promise<Response>;

/** Handler for a route. */
export interface Handler {
  /** Handles the given request. */
  handle: (request: RexRequest) => Response | Promise<Response>;

  /** The route to handle. */
  route: string | URLPattern;

  /** The HTTP method to handle. Defaults to GET. */
  method?: Method;
}
