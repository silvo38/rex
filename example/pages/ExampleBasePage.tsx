import { PageHandler } from "rex";
import type { VNode } from "preact";
import { assets } from "../src/assets.ts";

/** Base page template applied to all HTML pages in this server. */
export abstract class ExampleBasePage<Data> extends PageHandler<Data> {
  override layoutPage(component: VNode): VNode {
    return (
      <html>
        <head>
          <title>Rex Example Server</title>
          <link
            rel="shortcut icon"
            href={assets.dogIcon.url()}
            type="image/png"
          />
          <link href={assets.stylesCss.url()} rel="stylesheet" />
          <script type="module" src={assets.appJs.url()} defer />
        </head>
        <body>{component}</body>
      </html>
    );
  }
}
