import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertStrictEquals } from "@std/assert";
import { decodeProps, defineIsland, encodeProps } from "./mod.tsx";
import { render } from "preact-render-to-string";

function TestComponent({ foo, bar }: { foo: string; bar: number }) {
  return <span>Hello {foo} {bar}</span>;
}

const TestIsland = defineIsland(TestComponent);

describe("Island", () => {
  it("encodeProps and decodeProps can round-trip", () => {
    const props = { abc: [123, "xyz"] };
    const encoded = encodeProps(props);
    assertEquals(encoded, "%7B%22abc%22%3A%5B123%2C%22xyz%22%5D%7D");
    assertEquals(decodeProps(encoded), props);
  });

  it("island placeholder has correct attributes", () => {
    const html = render(<TestIsland foo="abc" bar={123} />);
    const expectedProps = encodeProps({ foo: "abc", bar: 123 });
    assertStrictEquals(
      html,
      render(<div data-component="TestComponent" data-props={expectedProps} />),
    );
  });

  // TODO: Figure out a simple way to test the hydrate functions.
});
