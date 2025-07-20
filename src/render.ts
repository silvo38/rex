import { render } from "preact-render-to-string";
import type { VNode } from "preact";
import { ContentType } from "./content_type.ts";
import { RexResponse } from "./response.ts";

/**
 * Renders the given Preact component to HTML, and embeds that in a Response.
 *
 * If doctype is true (the default), will add <!DOCTYPE html> to the start.
 */
export function renderHtml(
  component: VNode,
  { doctype = true }: { doctype?: boolean } = {},
): RexResponse {
  let html = doctype ? "<!DOCTYPE html>" : "";
  html += render(component);
  return new RexResponse(html).setContentType(ContentType.Html);
}
