import type { Handler } from "./handler.ts";
import { Method } from "./method.ts";

interface InternalRouteDefinition {
  method: Method;
  pattern: URLPattern;
  handler: Handler;
}

interface MatchedHandler {
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
 * const router = new Router()
 *   .add({ path: '/home', handler: homeHandler })
 *   .add({ path: '/post/:id', handler: postHandler });
 * ```
 */
export class Router {
  private readonly routes: InternalRouteDefinition[] = [];

  /** Adds an new route to the router. */
  add(handler: Handler) {
    const method = handler.method ?? Method.Get;
    let pattern = handler.path;
    if (typeof pattern === "string") {
      pattern = new URLPattern({ pathname: pattern });
    }
    this.routes.push({ method, pattern, handler });
  }

  /** Returns the first handler that matches the given path. */
  getHandler(path: string): MatchedHandler | null {
    for (const routes of this.routes) {
      const result = routes.pattern.exec(path);
      if (result) {
        return { route: result, handler: routes.handler };
      }
    }
    return null;
  }
}
