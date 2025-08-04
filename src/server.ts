import { Router } from "./router.ts";
import { Responses } from "./response.ts";
import { RexRequest } from "./request.ts";
import type { Handler } from "./handler.ts";
import { StaticFileHandler } from "./static.ts";
import { validateFlags } from "./flag.ts";
import { StaticDirectoryHandler } from "./static.ts";

/**
 * Main server entry point. Create routes with handlers using the `setRoutes`
 * method, and then call `serve()`.
 */
export class Server {
  private readonly router: Router;

  constructor() {
    this.router = new Router();

    // Validate flags as soon as possible.
    validateFlags();
  }

  /** Defines a new route. */
  addHandler(handler: Handler): Server {
    this.router.add(handler);
    return this;
  }

  /** Defines multiple new routes. */
  addHandlers(handlers: Iterable<Handler>): Server {
    for (const handler of handlers) {
      this.addHandler(handler);
    }
    return this;
  }

  /** Serves the file with the given path on disk at the specified route. */
  serveFile(route: string, path: string): Server {
    this.addHandler(new StaticFileHandler({ route, path }));
    return this;
  }

  /**
   * Serves the folder with the given path on disk at the specified route.
   * Supply a route like `/foo/bar/*` and a directory like `foo/bar`.
   */
  serveDirectory(route: string, directory: string): Server {
    this.addHandler(new StaticDirectoryHandler({ route, directory }));
    return this;
  }

  /**
   * Returns the handler which should handle the given request, or null if there
   * is no matching handler. Also returns the RexRequest (which embeds any
   * matched params).
   */
  matchHandler(
    request: Request,
  ): { handler: Handler; request: RexRequest } | null {
    const match = this.router.getHandler(request.url);
    if (!match) {
      return null;
    }
    const { handler, route } = match;
    return { handler, request: RexRequest.create(request, route) };
  }

  handle(request: Request): Response | Promise<Response> {
    const match = this.matchHandler(request);
    if (!match) {
      // TODO: Allow customising 404 response.
      return Responses.notFound();
    }

    // TODO: Catch errors?
    return match.handler.handle(match.request);
  }
}
