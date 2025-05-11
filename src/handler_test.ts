import { describe, it } from "@std/testing/bdd";
import { StaticFileHandler } from "./handler.ts";
import { Server } from "./server.ts";
import { assertStrictEquals } from "@std/assert";
import { assertOk } from "./testing/assert.ts";

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
  });
});
