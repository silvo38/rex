import { Router } from "./router.ts";
import { Responses } from "./response.ts";
import { RexRequest } from "./request.ts";
import type { Handler } from "./handler.ts";
import { Asset, AssetFolder } from "./asset.ts";
import { validateFlags } from "./flag.ts";

/**
 * Main server entry point. Create routes with handlers using the `setRoutes`
 * method, and then call `serve()`.
 */
export class Server {
  private readonly router: Router;

  constructor(opts?: { validateFlags?: boolean }) {
    this.router = new Router();

    // Validate flags as soon as possible.
    if (opts?.validateFlags ?? true) {
      validateFlags();
    }
  }

  /** Defines a new route. */
  addHandler(handler: Handler): Server {
    this.router.add(handler);
    return this;
  }

  /** Allows adding a collection of assets in one go. */
  addAssets(assets: Record<string, Asset>): Server {
    for (const asset of Object.values(assets)) {
      this.router.add(asset);
    }
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
    this.addHandler(new Asset({ route, path }));
    return this;
  }

  /**
   * Serves the folder with the given path on disk at the specified route.
   * Supply a route like `/foo/bar/*` and a directory like `foo/bar`.
   */
  serveDirectory(route: string, directory: string): Server {
    this.addHandler(new AssetFolder({ route, directory }));
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
