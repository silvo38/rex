import type { ContentType } from "./header.ts";
import { Method } from "./method.ts";
import type { RexRequest } from "./request.ts";
import { RexResponse } from "./response.ts";

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

/** Serves static files. */
export class StaticFileHandler implements Handler {
  readonly method = Method.Get;
  readonly contentType: string | ContentType;
  readonly route: string;
  readonly path: string;

  constructor(opts: {
    route: string;
    path: string;
    contentType: string | ContentType;
  }) {
    this.route = opts.route;
    this.path = opts.path;
    this.contentType = opts.contentType;
  }

  async handle(_request: RexRequest): Promise<RexResponse> {
    const bytes = await Deno.readFile(this.path);
    return new RexResponse(bytes).setContentType(this.contentType);
  }
}
