import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertStrictEquals } from "@std/assert";
import { Router } from "./router.ts";
import type { RexRequest } from "./request.ts";
import { Responses } from "./response.ts";

function fakeHandler1(_request: RexRequest) {
  return Responses.ok();
}

function fakeHandler2(_request: RexRequest) {
  return Responses.ok();
}

describe("Router", () => {
  it("supports relative paths as strings", () => {
    const router = new Router([{ path: "/abc", handler: fakeHandler1 }]);
    const result = router.getHandler("http://example.com/abc");
    assertStrictEquals(result?.handler, fakeHandler1);
  });

  it("supports relative paths as URLPatterns", () => {
    const router = new Router([
      {
        path: new URLPattern({ pathname: "/post/:id" }),
        handler: fakeHandler1,
      },
    ]);
    const result = router.getHandler("http://example.com/post/123");
    assertStrictEquals(result?.handler, fakeHandler1);
  });

  it("getHandler returns null if there is no matching route", () => {
    const router = new Router([
      { path: "/abc", handler: fakeHandler1 },
    ]);
    const result = router.getHandler("http://example.com/xyz");
    assertStrictEquals(result, null);
  });

  it("getHandler returns the first matching handler", () => {
    const router = new Router([
      { path: "/abc", handler: fakeHandler1 },
      { path: "/abc", handler: fakeHandler2 },
    ]);
    const result = router.getHandler("http://example.com/abc");
    assertStrictEquals(result?.handler, fakeHandler1);
  });

  it("getHandler returns the match result", () => {
    const router = new Router([
      {
        path: new URLPattern({ pathname: "/post/:id" }),
        handler: fakeHandler1,
      },
    ]);
    const result = router.getHandler("http://example.com/post/123");
    assertStrictEquals(result?.handler, fakeHandler1);
    assertStrictEquals(result?.route.hostname.input, "example.com");
    assertStrictEquals(result?.route.pathname.input, "/post/123");
    assertEquals(result?.route.pathname.groups, { id: "123" });
  });
});
