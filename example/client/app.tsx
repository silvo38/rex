import * as _Preact from "preact";
import { thisIsADependency } from "./library.ts";
import { Counter } from "./Counter.tsx";

export function hello(): number {
  return thisIsADependency() * 10;
}

// Render the Counter component on the page.
_Preact.render(<Counter />, document.getElementById("counter")!);
