import { describe, it } from "@std/testing/bdd";
import { assertStrictEquals } from "@std/assert/strict-equals";
import { renderHtml } from "./render.ts";

describe("renderHtml", () => {
  it("can render JSX", async () => {
    const response = renderHtml(<div>Hello</div>);
    assertStrictEquals(await response.text(), "<div>Hello</div>");
  });

  it("can render custom components", async () => {
    const CustomComponent = ({ name }: { name: string }) => (
      <div>Hello {name}</div>
    );
    const response = renderHtml(<CustomComponent name="Cam" />);
    assertStrictEquals(await response.text(), "<div>Hello Cam</div>");
  });
});
