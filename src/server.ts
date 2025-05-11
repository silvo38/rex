import { type Route, Router, type Routes } from "./router.ts";
import { Responses } from "./response.ts";
import { RexRequest } from "./request.ts";

/**
 * Main server entry point. Create routes with handlers using the `setRoutes`
 * method, and then call `serve()`.
 */
export class Server {
  private readonly router: Router;

  constructor() {
    this.router = new Router();
  }

  /** Defines a new route. */
  addRoute(route: Route): Server {
    this.router.add(route);
    return this;
  }

  /** Defines multiple new routes. */
  addRoutes(routes: Routes): Server {
    for (const route of routes) {
      this.addRoute(route);
    }
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
    return route.handler(requestWrapper);
  }
}
