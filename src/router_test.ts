import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertStrictEquals } from "@std/assert";
import { Router } from "./router.ts";
import { Responses } from "./response.ts";
import type { Handler } from "./handler.ts";

class FakeHandler implements Handler {
  path = "/abc";
  handle() {
    return Responses.ok();
  }
}

const fakeHandler1 = new FakeHandler();
const fakeHandler2 = new FakeHandler();

describe("Router", () => {
  let router: Router;

  beforeEach(() => {
    router = new Router();
  });

  it("supports relative paths as strings", () => {
    router.add(fakeHandler1);
    const result = router.getHandler("http://example.com/abc");
    assertStrictEquals(result?.handler, fakeHandler1);
  });

  it("supports relative paths as URLPatterns", () => {
    const handler: Handler = {
      path: new URLPattern({ pathname: "/post/:id" }),
      handle: () => Responses.ok(),
    };
    router.add(handler);
    const result = router.getHandler("http://example.com/post/123");
    assertStrictEquals(result?.handler, handler);
  });

  it("getHandler returns null if there is no matching route", () => {
    router.add(fakeHandler1);
    const result = router.getHandler("http://example.com/xyz");
    assertStrictEquals(result, null);
  });

  it("getHandler returns the first matching handler", () => {
    router.add(fakeHandler1);
    router.add(fakeHandler2);
    const result = router.getHandler("http://example.com/abc");
    assertStrictEquals(result?.handler, fakeHandler1);
  });

  it("getHandler returns the match result", () => {
    const handler: Handler = {
      path: new URLPattern({ pathname: "/post/:id" }),
      handle: () => Responses.ok(),
    };
    router.add(handler);
    const result = router.getHandler("http://example.com/post/123");
    assertStrictEquals(result?.handler, handler);
    assertStrictEquals(result?.route.hostname.input, "example.com");
    assertStrictEquals(result?.route.pathname.input, "/post/123");
    assertEquals(result?.route.pathname.groups, { id: "123" });
  });
});
