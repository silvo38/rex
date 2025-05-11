import { render } from "preact-render-to-string";
import { VNode } from "preact";
import { ContentType } from "./header.ts";
import { RexResponse } from "./response.ts";

/**
 * Renders the given Preact component to HTML, and embeds that in a Response.
 */
export function renderHtml(component: VNode): RexResponse {
  const html = render(component);
  return new RexResponse(html).setContentType(ContentType.Html);
}
