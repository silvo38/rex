// import { renderToString } from "preact-render-to-string";
// import { ExampleComponent } from "./ExampleComponent.tsx";
import { Router, Routes } from "./router.ts";
import { Responses } from "./response.ts";
import { RexRequest } from "./request.ts";

/**
 * Main server entry point. Create routes with handlers using the `setRoutes`
 * method, and then call `serve()`.
 */
export class Server {
  private router: Router;

  constructor(routes: Routes) {
    this.router = new Router(routes);
  }

  setRoutes(routes: Routes): Server {
    this.router = new Router(routes);
    return this;
  }

  // serve() {
  //   Deno.serve((request) => this.handle(request));
  //   //   return new Response(renderToString(ExampleComponent()));
  // }

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
