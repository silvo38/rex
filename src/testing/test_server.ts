import type { Handler } from "../handler.ts";
import { Server } from "../server.ts";

/** Adds extra functionality to Server for testing. */
export class TestServer extends Server {
  /** Supports Request objects as well as string paths (basic GET). */
  override handle(request: Request | string): Response | Promise<Response> {
    if (typeof request === "string") {
      request = new Request(`http://localhost${request}`);
    }
    return super.handle(request);
  }
}

/** Tests a single handler. */
export function testHandler(
  handler: Handler,
  request: Request | string,
): Response | Promise<Response> {
  const server = new TestServer();
  server.addHandler(handler);
  return server.handle(request);
}
