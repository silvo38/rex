import { thisIsADependency } from "./library.ts";
import { Counter } from "./Counter.tsx";
import { hydrateIslands } from "rex/islands";
import { createElement, render } from "preact";

export function hello(): number {
  return thisIsADependency() * 10;
}

// Render all Counter components on the page.
hydrateIslands(Counter, createElement, render);
