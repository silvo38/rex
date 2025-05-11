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

  /** The path to handle. */
  path: string | URLPattern;

  /** The HTTP method to handle. Defaults to GET. */
  method?: Method;
}

/** Serves static files. */
export class StaticFileHandler implements Handler {
  readonly method = Method.Get;
  readonly contentType: string | ContentType;
  readonly path: string;
  readonly filesystemPath: string;

  constructor(
    { path, filesystemPath, contentType }: {
      path: string;
      filesystemPath: string;
      contentType: string | ContentType;
    },
  ) {
    this.path = path;
    this.filesystemPath = filesystemPath;
    this.contentType = contentType;
  }

  async handle(_request: RexRequest): Promise<RexResponse> {
    const bytes = await Deno.readFile(this.filesystemPath);
    return new RexResponse(bytes).setContentType(this.contentType);
  }
}
