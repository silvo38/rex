import { assert, assertStrictEquals } from "@std/assert";
import type { Status } from "../status.ts";

export function assertOk(response: Response) {
  assert(response.ok);
}

export function assertStatus(response: Response, status: Status) {
  assertStrictEquals(response.status, status);
}
