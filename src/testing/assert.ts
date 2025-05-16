import { assert, assertStrictEquals } from "@std/assert";
import type { Status } from "../status.ts";
import { Header } from "../header.ts";
import type { ContentType } from "../content_type.ts";

export function assertOk(response: Response) {
  assert(response.ok, `Response status code was not OK: ${response.status}`);
}

export function assertStatus(response: Response, status: Status) {
  assertStrictEquals(response.status, status);
}

export function assertContentType(
  response: Response,
  contentType: ContentType | string | null,
) {
  assertStrictEquals(
    response.headers.get(Header.ContentType),
    contentType,
    `Content-Type header did not match`,
  );
}
