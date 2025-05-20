import { describe, it } from "@std/testing/bdd";
import { PageHandler } from "./page_handler.ts";
import type { RexRequest } from "./request.ts";
import { testHandler } from "./testing/test_server.ts";
import { assertContentType, assertOk } from "./testing/assert.ts";
import { ContentType } from "./content_type.ts";
import { assertStrictEquals } from "@std/assert/strict-equals";
import type { VNode } from "preact";

class TestPageHandler extends PageHandler {
  override route = "/abc";

  requestReceived?: RexRequest;

  override render(request: RexRequest) {
    this.requestReceived = request;
    return <h1>Hello</h1>;
  }
}

describe("PageHandler", () => {
  it("sets the HTML Content-Type", async () => {
    const response = await testHandler(new TestPageHandler(), "/abc");
    assertOk(response);
    assertContentType(response, ContentType.Html);
  });

  it("render method receives the request object", async () => {
    const handler = new TestPageHandler();
    await testHandler(handler, "/abc");
    assertStrictEquals(handler.requestReceived?.path, "/abc");
  });

  it("response body contains the component as HTML", async () => {
    const response = await testHandler(new TestPageHandler(), "/abc");
    assertStrictEquals(await response.text(), "<h1>Hello</h1>");
  });

  it("response body contains the component as HTML", async () => {
    const handler = new class extends TestPageHandler {
      override layoutPage(component: VNode) {
        return <html>{component}</html>;
      }
    }();
    const response = await testHandler(handler, "/abc");
    assertStrictEquals(await response.text(), "<html><h1>Hello</h1></html>");
  });
});
