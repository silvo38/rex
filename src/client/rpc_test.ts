import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { assertSpyCalls, type Stub, stub } from "@std/testing/mock";
import { sendRpc } from "./rpc.ts";
import {
  assertEquals,
  assertRejects,
  assertStrictEquals,
  assertThrows,
} from "@std/assert";

describe("sendRpc", () => {
  let fetchStub: Stub;

  beforeEach(() => {
    fetchStub = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(new Response("{}")),
    );
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it("calls fetch with correct arguments", async () => {
    await sendRpc("MyService", "myRpc", "POST", { foo: 123 });

    assertSpyCalls(fetchStub, 1);
    const args = fetchStub.calls[0].args;
    assertStrictEquals(args[0], "/api/MyService/myRpc");
    assertEquals(args[1], {
      body: '{"foo":123}',
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
  });

  it("parses response as JSON", async () => {
    fetchStub.restore();
    fetchStub = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(new Response('{"foo": 123}')),
    );

    const response = await sendRpc("MyService", "myRpc", "POST", {});

    assertEquals(response, { foo: 123 });
  });

  it("parses response as JSON", () => {
    fetchStub.restore();
    fetchStub = stub(
      globalThis,
      "fetch",
      () =>
        Promise.resolve(
          new Response("body", { status: 404, statusText: "statusText" }),
        ),
    );

    assertRejects(
      () => sendRpc("MyService", "myRpc", "POST", {}),
      Error,
      "RPC error: statusText body",
    );
  });
});
