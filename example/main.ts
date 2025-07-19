import { Server, StaticDirectoryHandler, StaticFileHandler } from "rex";
import { HomePage } from "./pages/HomePage.tsx";

const server = new Server()
  .addHandler(new HomePage())
  // Serve the icons directory under /icons.
  .addHandler(
    new StaticDirectoryHandler({
      route: "/icons/*",
      directory: "static/icons",
    }),
  )
  // Serve the generated CSS file as /styles.css.
  .addHandler(
    new StaticFileHandler({
      route: "/styles.css",
      path: "static/styles.gen.css",
    }),
  );

// Start the Deno HTTP server, and forward all requests to your Rex server.
Deno.serve((request) => server.handle(request));
