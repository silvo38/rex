import { assert } from "@std/assert";
import type { Handler } from "../handler.ts";
import type { PageHandler } from "../page_handler.ts";
import { Server } from "../server.ts";

/** Tests a single handler. */
export function testHandler(
  handler: Handler,
  request: Request | string,
): Response | Promise<Response> {
  return new Server()
    .addHandler(handler)
    .handle(toRequest(request));
}

/** Invokes the given page handler's load method. */
export async function testPageHandler<Data>(
  handler: PageHandler<Data>,
  request: Request | string,
): Promise<Data> {
  const server = new Server().addHandler(handler);
  const match = server.matchHandler(toRequest(request));
  assert(match, `Handler did not match request: ${request}`);
  return await handler.load(match.request);
}

function toRequest(request: Request | string): Request {
  return typeof request === "string"
    ? new Request(`http://localhost${request}`)
    : request;
}
