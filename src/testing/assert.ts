import { assert, assertStrictEquals } from "@std/assert";
import type { Status } from "../status.ts";

export function assertOk(response: Response) {
  assert(response.ok, `Response status code was not OK: ${response.status}`);
}

export function assertStatus(response: Response, status: Status) {
  assertStrictEquals(response.status, status);
}
