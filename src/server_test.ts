import { beforeEach, describe, it } from "@std/testing/bdd";
import { Server } from "./server.ts";
import { assertContentType, assertOk, assertStatus } from "./testing/assert.ts";
import { Status } from "./status.ts";
import {
  assertEquals,
  assertInstanceOf,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";
import { RexRequest } from "./request.ts";
import { ContentType } from "./content_type.ts";
import { BoolFlag, Flag } from "./flag.ts";
import { cacheAssets } from "./flags.ts";
import { Asset } from "@silvo38/rex";

describe("Server", () => {
  let server: Server;

  beforeEach(() => {
    server = new Server({ validateFlags: false });
    cacheAssets.setValueForTest(false);
  });

  it("invokes correct handler", async () => {
    server.addHandlers([
      { route: "/abc", handle: () => new Response("hello") },
      { route: "/xyz", handle: () => new Response("world") },
    ]);
    const response = await server.handle(new Request("http://example.com/abc"));
    assertOk(response);
    assertStrictEquals(await response.text(), "hello");
  });

  it("wraps request and forwards to handler", async () => {
    let requestReceived: RexRequest | undefined = undefined;
    server.addHandler({
      route: "/post/:id",
      handle: (request: RexRequest) => {
        requestReceived = request;
        return new Response();
      },
    });

    const response = await server.handle(
      new Request("http://example.com/post/abc"),
    );

    assertOk(response);
    assertInstanceOf(requestReceived, RexRequest);
    const request = requestReceived as RexRequest;
    assertEquals(request.params, { id: "abc" });
    assertStrictEquals(request.path, "/post/abc");
  });

  it("returns 404 for missing routes", async () => {
    const response = await server.handle(new Request("http://example.com/abc"));
    assertStatus(response, Status.NotFound);
  });

  it("routes added earlier take priority", async () => {
    server
      .addHandler({ route: "/abc", handle: () => new Response("hello") })
      .addHandler({ route: "/abc", handle: () => new Response("world") });

    const response = await server.handle(
      new Request("http://example.com/abc"),
    );

    assertOk(response);
    assertStrictEquals(await response.text(), "hello");
  });

  it("serveFile works", async () => {
    server.serveFile("/abc", "./src/testdata/hello.html");

    const response = await server.handle(
      new Request("http://example.com/abc"),
    );

    assertOk(response);
    assertContentType(response, ContentType.Html);
  });

  it("serveDirectory works", async () => {
    server.serveDirectory("/abc/*", "./src/testdata");

    const response = await server.handle(
      new Request("http://example.com/abc/hello.html"),
    );

    assertOk(response);
    assertContentType(response, ContentType.Html);
  });

  it("validates flags in constructor", () => {
    Flag.getEnvVar = () => "bar";
    new BoolFlag("FOO");
    assertThrows(
      () => new Server(),
      Error,
      "Invalid boolean value [bar] for flag",
    );
  });

  it("does not validates flags in constructor if told not to", () => {
    Flag.getEnvVar = () => "bar";
    new BoolFlag("FOO");
    new Server({ validateFlags: false });
  });

  it("can install a collection of assets", async () => {
    const assets = {
      foo: new Asset({ route: "/foo", path: "./src/testdata/hello.html" }),
      bar: new Asset({ route: "/bar", path: "./src/testdata/hello.html" }),
    };
    server.addAssets(assets);

    const response1 = await server.handle(
      new Request("http://example.com/foo"),
    );
    const response2 = await server.handle(
      new Request("http://example.com/foo"),
    );

    assertOk(response1);
    assertContentType(response1, ContentType.Html);
    assertOk(response2);
    assertContentType(response2, ContentType.Html);
  });
});
