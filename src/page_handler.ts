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
 *
 * `Data` is a generic parameter allowing you to specify the intermediate result
 * of the handler. Most business logic should be implemented by the `load`
 * method, and it returns some `Data` that the `render` method will use to
 * render.
 */
export abstract class PageHandler<Data> implements Handler {
  abstract route: string | URLPattern;

  /** Processes the request, and loads and transforms intermediate data. */
  abstract load(request: RexRequest): Data | Promise<Data>;

  /**
   * Returns the Preact component to render. Will be invoked with the result
   * from `load`. This ideally should be a pure transformation of the
   * request/data to HTML.
   */
  abstract render(data: Data, request: RexRequest): VNode | Promise<VNode>;

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
    const data = await this.load(request);
    const component = await this.render(data, request);
    const page = this.layoutPage(component);
    return renderHtml(page);
  }
}
