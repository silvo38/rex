import { assert } from "@std/assert";
import type { Handler } from "../handler.ts";
import type { PageHandler } from "../page_handler.ts";
import { Server } from "../server.ts";
import type { RexRequest } from "../request.ts";
import { renderTestComponent } from "./dom.ts";
import type { HTMLDocument } from "@b-fuze/deno-dom";

/**
 * Checks that the request matches the given handler's route. Returns a
 * RexRequest, which contains matching route params.
 */
export function bindRequest(
  handler: Handler,
  request: Request | string,
): RexRequest {
  const match = new Server()
    .addHandler(handler)
    .matchHandler(toRequest(request));
  assert(match, `Handler did not match request: ${request}`);
  return match.request;
}

/** Tests a single handler. */
export function testHandler(
  handler: Handler,
  request: Request | string,
): Response | Promise<Response> {
  return handler.handle(bindRequest(handler, request));
}

/** Invokes the given page handler's load method. */
export async function testPageHandler<Data>(
  handler: PageHandler<Data>,
  request: Request | string,
): Promise<Data> {
  return await handler.load(bindRequest(handler, request));
}

/** Invokes the given page handler's load and render methods. */
export async function testPageRender<Data>(
  handler: PageHandler<Data>,
  request: Request | string,
): Promise<HTMLDocument> {
  const rexRequest = bindRequest(handler, request);
  const data = await handler.load(rexRequest);
  const component = await handler.render(data, rexRequest);
  return renderTestComponent(component);
}

function toRequest(request: Request | string): Request {
  return typeof request === "string"
    ? new Request(`http://localhost${request}`)
    : request;
}
