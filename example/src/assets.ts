import { Asset } from "rex";

/** All static assets used in the example app. */
export const assets = {
  // Serve the generated CSS file as /styles.css.
  stylesCss: new Asset({ route: "/styles.css", path: "./dist/styles.css" }),
  // Serve the bundled JS file (and sourcemap).
  appJs: new Asset({ route: "/app.js", path: "dist/app.js" }),
  appJsMap: new Asset({ route: "/app.js.map", path: "dist/app.js.map" }),
  // dog.png icon
  dogIcon: new Asset({
    route: "/icons/dog.png",
    path: "./static/icons/dog.png",
  }),
  // TODO: Demo how to use AssetFolder too.
};
