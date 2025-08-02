import { Server } from "rex";
import { HomePage } from "./pages/HomePage.tsx";

const server = new Server()
  .addHandler(new HomePage())
  // Serve the icons directory under /icons.
  .serveDirectory("/icons/*", "static/icons")
  // Serve the generated CSS file as /styles.css.
  .serveFile("/styles.css", "dist/styles.css")
  // Serve the bundled JS file (and sourcemap).
  .serveFile("/app.js", "dist/app.js")
  .serveFile("/app.js.map", "dist/app.js.map");

// Start the Deno HTTP server, and forward all requests to your Rex server.
Deno.serve((request) => server.handle(request));
