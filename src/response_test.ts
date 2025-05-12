import { describe, it } from "@std/testing/bdd";
import { RexResponse } from "./response.ts";
import { ContentType } from "./content_type.ts";
import { assertStrictEquals } from "@std/assert/strict-equals";

describe("RexResponse", () => {
  it("can set Content-Type", () => {
    const response = new RexResponse();
    assertStrictEquals(response.getContentType(), null);
    response.setContentType(ContentType.Html);
    assertStrictEquals(response.getContentType(), ContentType.Html);
    response.setContentType("asdf");
    assertStrictEquals(response.getContentType(), "asdf");
  });
});
