import { describe, it } from "@std/testing/bdd";
import { StaticDirectoryHandler, StaticFileHandler } from "./static.ts";
import { assertStrictEquals, assertThrows } from "@std/assert";
import { assertContentType, assertOk } from "./testing/assert.ts";
import { Header } from "./header.ts";
import { ContentType } from "./content_type.ts";
import { testHandler } from "./testing/test_server.ts";

describe("StaticFileHandler", () => {
  it("returns the file on disc", async () => {
    const response = await testHandler(
      new StaticFileHandler({
        route: "/abc",
        path: "./src/testdata/hello.txt",
        contentType: "content-type",
      }),
      "/abc",
    );
    assertOk(response);
    assertStrictEquals(await response.text(), "Hello\n");
    assertContentType(response, "content-type");
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
    const response = await testHandler(
      new StaticFileHandler({
        route: "/abc",
        path: "./src/testdata/hello.html",
      }),
      "/abc",
    );
    assertOk(response);
    assertContentType(response, ContentType.Html);
  });
});

describe("StaticDirectoryHandler", () => {
  it("can serve multiple files", async () => {
    const handler = new StaticDirectoryHandler({
      route: "/abc/*",
      directory: "./src/testdata",
    });

    const response1 = await testHandler(handler, "/abc/hello.html");
    assertOk(response1);
    assertStrictEquals(await response1.text(), "<h1>Hello</h1>\n");
    assertContentType(response1, ContentType.Html);
    assertStrictEquals(
      response1.headers.get(Header.ContentType),
      ContentType.Html,
    );

    const response2 = await testHandler(handler, "/abc/hello.txt");
    assertOk(response2);
    assertStrictEquals(await response2.text(), "Hello\n");
    assertContentType(response2, null);
  });

  it("checks directory existence on creation", () => {
    assertThrows(() =>
      new StaticDirectoryHandler({
        route: "/abc",
        directory: "./does-not-exist",
      }), Deno.errors.NotFound);
  });
});
