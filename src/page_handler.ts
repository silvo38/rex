import type { VNode } from "preact";
import type { Handler } from "./handler.ts";
import type { RexRequest } from "./request.ts";
import type { RexResponse } from "./response.ts";
import { renderHtml } from "./render.ts";

/**
 * Renders an HTML page using Preact.
 *
 * Subclasses must implement the `render` method and return a Preact component.
 * Usually you will implement the `layoutPage` method in order to embed the
 * component within some generic HTML page skeleton.
 */
export abstract class PageHandler implements Handler {
  abstract route: string | URLPattern;

  /** Returns the Preact component to render. */
  abstract render(request: RexRequest): VNode | Promise<VNode>;

  /**
   * Embeds the Preact component within a page. Returns the final page HTML.
   *
   * The default implementation just converts the component directly to HTML.
   * Subclasses can do more advanced processing.
   */
  layoutPage(component: VNode): VNode {
    return component;
  }

  async handle(request: RexRequest): Promise<RexResponse> {
    const component = await this.render(request);
    const page = this.layoutPage(component);
    return renderHtml(page);
  }
}
