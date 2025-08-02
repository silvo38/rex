import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertStrictEquals } from "@std/assert";
import { assertOk, assertStatus } from "./testing/assert.ts";
import { testHandler } from "./testing/test_server.ts";
import { RpcHandler } from "./rpc_handler.ts";
import { Method } from "./method.ts";
import { Status } from "./status.ts";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { assertContentType } from "@silvo38/rex/testing";
import { ContentType } from "./content_type.ts";

interface TestRequest {
  foo: string;
}

interface TestResponse {
  bar: number;
}

class TestRpcHandler extends RpcHandler<TestRequest, TestResponse> {
  override route = "/foo";
  override method = Method.Post;

  override rpc(_request: TestRequest): TestResponse {
    return { bar: 123 };
  }
}

describe("RpcHandler", () => {
  it("parses JSON from request", async () => {
    const handler = new TestRpcHandler();
    using rpcSpy = spy(handler, "rpc");

    const response = await testHandler(
      handler,
      new Request("http://localhost/foo", {
        body: JSON.stringify({ foo: "abc" }),
        method: Method.Post,
      }),
    );

    assertOk(response);
    assertSpyCalls(rpcSpy, 1);
    assertEquals(rpcSpy.calls[0].args[0], { foo: "abc" });
  });

  it("encodes response as JSON", async () => {
    const response = await testHandler(
      new TestRpcHandler(),
      new Request("http://localhost/foo", {
        body: JSON.stringify({ foo: "abc" }),
        method: Method.Post,
      }),
    );

    assertOk(response);
    assertContentType(response, ContentType.Json);
    assertEquals(await response.json(), { bar: 123 });
  });

  it("returns error for bad request", async () => {
    const response = await testHandler(
      new TestRpcHandler(),
      new Request("http://localhost/foo", {
        body: "x",
        method: Method.Post,
      }),
    );
    assertStatus(response, Status.BadRequest);
    assertStrictEquals(
      await response.text(),
      "400 Bad Request: Malformed JSON in request",
    );
  });
});
