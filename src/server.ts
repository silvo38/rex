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

  handle(request: Request): Response | Promise<Response> {
    const route = this.router.getHandler(request.url);
    if (!route) {
      // TODO: Allow customising 404 response.
      return Responses.notFound();
    }

    const requestWrapper = RexRequest.create(request, route.route);
    // TODO: Catch errors?
    return route.handler.handle(requestWrapper);
  }
}
