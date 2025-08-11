import { beforeEach, describe, it } from "@std/testing/bdd";
import { Asset, AssetFolder } from "./asset.ts";
import { assertStrictEquals, assertThrows } from "@std/assert";
import { assertContentType, assertOk } from "./testing/assert.ts";
import { Header } from "./header.ts";
import { ContentType } from "./content_type.ts";
import { testHandler } from "./testing/test_server.ts";
import { assetVersion, cacheAssets } from "./flags.ts";

const HELLO_HTML = "./src/testdata/hello.html";

describe("Asset", () => {
  beforeEach(() => {
    cacheAssets.setValueForTest(false);
  });

  it("returns the file on disk", async () => {
    const response = await testHandler(
      new Asset({
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
      new Asset({
        route: "/abc",
        path: "./does-not-exist",
        contentType: "whatever",
      }), Deno.errors.NotFound);
  });

  it("infers content type", async () => {
    const response = await testHandler(
      new Asset({
        route: "/abc",
        path: HELLO_HTML,
      }),
      "/abc",
    );
    assertOk(response);
    assertContentType(response, ContentType.Html);
  });

  it("url() returns the route when caching is disabled", () => {
    cacheAssets.setValueForTest(false);
    const asset = new Asset({ route: "/abc", path: HELLO_HTML });
    assertStrictEquals(asset.url(), "/abc");
  });

  it("url() returns the versioned URL when caching is enabled", () => {
    assetVersion.setValueForTest("asdfasdf");
    cacheAssets.setValueForTest(true);
    const asset = new Asset({ route: "/abc", path: HELLO_HTML });
    assertStrictEquals(asset.url(), "/abc?v=asdfasdf");
  });
});

describe("AssetFolder", () => {
  beforeEach(() => {
    cacheAssets.setValueForTest(false);
  });

  it("can serve multiple files", async () => {
    const handler = new AssetFolder({
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
      new AssetFolder({
        route: "/abc",
        directory: "./does-not-exist",
      }), Deno.errors.NotFound);
  });
});
