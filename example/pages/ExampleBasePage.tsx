import { PageHandler } from "rex";
import type { VNode } from "preact";

/** Base page template applied to all HTML pages in this server. */
export abstract class ExampleBasePage<Data> extends PageHandler<Data> {
  override layoutPage(component: VNode): VNode {
    return (
      <html>
        <head>
          <title>Rex Example Server</title>
          <link rel="shortcut icon" href="/icons/dog.png" type="image/png" />
          <link href="/styles.css" rel="stylesheet" />
          <script type="module" src="/app.js" defer />
        </head>
        <body>{component}</body>
      </html>
    );
  }
}
