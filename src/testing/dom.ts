import { DOMParser, type HTMLDocument } from "@b-fuze/deno-dom";
import { render } from "preact-render-to-string";
import type { VNode } from "preact";

/** Renders a Preact component to a string, and then parses it via DOMParser. */
export function renderTestComponent(component: VNode): HTMLDocument {
  const html = render(component);
  return new DOMParser().parseFromString(html, "text/html");
}
