import { describe, it } from "@std/testing/bdd";
import { ContentType, inferContentType } from "./content_type.ts";
import { assertStrictEquals } from "@std/assert/strict-equals";

describe("inferContentType", () => {
  it("works", () => {
    assertStrictEquals(inferContentType(".css"), ContentType.Css);
    assertStrictEquals(inferContentType(".html"), ContentType.Html);
    assertStrictEquals(inferContentType(".js"), ContentType.JavaScript);
    assertStrictEquals(inferContentType(".png"), ContentType.Png);
    assertStrictEquals(inferContentType(".svg"), ContentType.Svg);
    assertStrictEquals(inferContentType(".unknown"), null);
  });
});
