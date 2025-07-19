import { thisIsADependency } from "./library.ts";

export function hello(): number {
  return thisIsADependency() * 10;
}
