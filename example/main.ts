import { Server } from "rex";
import { HomePage } from "./pages/HomePage.tsx";
import { SayHelloHandler } from "./rpcs/SayHelloHandler.ts";
import { assets } from "./src/assets.ts";

const server = new Server()
  .addHandler(new HomePage())
  .addHandler(new SayHelloHandler())
  // Serve all static assets.
  .addAssets(assets);

// Start the Deno HTTP server, and forward all requests to your Rex server.
Deno.serve((request) => server.handle(request));
