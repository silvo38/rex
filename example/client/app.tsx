import * as _Preact from "preact";
import { thisIsADependency } from "./library.ts";
import { Counter } from "./Counter.tsx";
import { hydrateIslands } from "./hydrate.ts";

export function hello(): number {
  return thisIsADependency() * 10;
}

// Render all Counter components on the page.
hydrateIslands(Counter);
