import { describe, it } from "@std/testing/bdd";
import { RexResponse } from "./response.ts";
import { ContentType } from "./content_type.ts";
import { assertStrictEquals } from "@std/assert/strict-equals";
import { assertHeader } from "./testing/assert.ts";
import { Header } from "./header.ts";

describe("RexResponse", () => {
  it("can set Content-Type", () => {
    const response = new RexResponse();
    assertStrictEquals(response.getContentType(), null);
    response.setContentType(ContentType.Html);
    assertStrictEquals(response.getContentType(), ContentType.Html);
    response.setContentType("asdf");
    assertStrictEquals(response.getContentType(), "asdf");
    assertHeader(response, Header.ContentType, "asdf");
  });

  it("can set Cache-Control", () => {
    const response = new RexResponse();
    assertStrictEquals(response.getCacheControl(), null);
    response.setCacheControl("asdf");
    assertStrictEquals(response.getCacheControl(), "asdf");
    assertHeader(response, Header.CacheControl, "asdf");
  });

  it("can set the SESSION cookie", () => {
    const response = new RexResponse();
    assertStrictEquals(response.getSessionCookie(), null);
    response.setSessionCookie("asdf");
    assertStrictEquals(response.getSessionCookie(), "asdf");
    assertHeader(response, Header.SetCookie, "SESSION=asdf");
  });
});
