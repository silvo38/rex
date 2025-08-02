import { callGreetingRpc } from "./library.ts";
import { Counter } from "./Counter.tsx";
import { hydrateIslands } from "rex/client";

callGreetingRpc();

// Render all Counter components on the page.
hydrateIslands(Counter);
