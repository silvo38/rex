import { describe, it } from "@std/testing/bdd";
import { StaticDirectoryHandler, StaticFileHandler } from "./static.ts";
import { Server } from "./server.ts";
import { assertStrictEquals, assertThrows } from "@std/assert";
import { assertOk } from "./testing/assert.ts";
import { Header } from "./header.ts";
import { ContentType } from "./content_type.ts";

describe("StaticFileHandler", () => {
  it("returns the file on disc", async () => {
    const server = new Server().addHandler(
      new StaticFileHandler({
        route: "/abc",
        path: "./src/testdata/hello.txt",
        contentType: "content-type",
      }),
    );
    const response = await server.handle(new Request("http://example.com/abc"));
    assertOk(response);
    assertStrictEquals(await response.text(), "Hello\n");
    assertStrictEquals(
      response.headers.get(Header.ContentType),
      "content-type",
    );
  });

  it("checks file existence on creation", () => {
    assertThrows(() =>
      new StaticFileHandler({
        route: "/abc",
        path: "./does-not-exist",
        contentType: "whatever",
      }), Deno.errors.NotFound);
  });

  it("infers content type", async () => {
    const server = new Server().addHandler(
      new StaticFileHandler({
        route: "/abc",
        path: "./src/testdata/hello.html",
      }),
    );
    const response = await server.handle(new Request("http://example.com/abc"));
    assertOk(response);
    assertStrictEquals(
      response.headers.get(Header.ContentType),
      ContentType.Html,
    );
  });
});

describe("StaticDirectoryHandler", () => {
  it("can serve multiple files", async () => {
    const server = new Server().addHandler(
      new StaticDirectoryHandler({
        route: "/abc/*",
        directory: "./src/testdata",
      }),
    );

    const response1 = await server.handle(
      new Request("http://example.com/abc/hello.html"),
    );
    assertOk(response1);
    assertStrictEquals(await response1.text(), "<h1>Hello</h1>\n");
    assertStrictEquals(
      response1.headers.get(Header.ContentType),
      ContentType.Html,
    );

    const response2 = await server.handle(
      new Request("http://example.com/abc/hello.txt"),
    );
    assertOk(response2);
    assertStrictEquals(await response2.text(), "Hello\n");
    assertStrictEquals(response2.headers.get(Header.ContentType), null);
  });

  it("checks directory existence on creation", () => {
    assertThrows(() =>
      new StaticDirectoryHandler({
        route: "/abc",
        directory: "./does-not-exist",
      }), Deno.errors.NotFound);
  });
});
