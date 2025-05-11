import { Handler } from "./handler.ts";
import { Method } from "./method.ts";

export interface Route {
  method?: Method;
  path: string | URLPattern;
  handler: Handler;
}

export type Routes = readonly Route[];

interface InternalRouteDefinition {
  method: Method;
  pattern: URLPattern;
  handler: Handler;
}

interface MatchedRoute {
  handler: Handler;
  route: URLPatternResult;
}

/**
 * Routes requests to matching handlers.
 *
 * Routes can be supplied as raw strings, or as `URLPattern` instances for more
 * control. Strings will be converted to `URLPattern` instances. See
 * https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API for details
 * on the supported syntax.
 *
 * Example:
 *
 * ```
 * const router = new Router([
 *   { path: '/home', handler: homeHandler },
 *   { path: '/post/:id', handler: postHandler },
 * ]);
 * ```
 */
export class Router {
  private readonly routes: InternalRouteDefinition[] = [];

  constructor(routes: Routes) {
    this.routes = routes.map((route) => {
      const method = route.method ?? Method.Get;
      let pattern = route.path;
      if (typeof pattern === "string") {
        pattern = new URLPattern({ pathname: pattern });
      }
      return { method, pattern, handler: route.handler };
    });
  }

  /** Returns the first handler that matches the given path. */
  getHandler(path: string): MatchedRoute | null {
    for (const route of this.routes) {
      const result = route.pattern.exec(path);
      if (result) {
        return { route: result, handler: route.handler };
      }
    }
    return null;
  }
}
