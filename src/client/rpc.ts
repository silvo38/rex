import { ContentType } from "../content_type.ts";
import { Header } from "../header.ts";

/** Sends an RPC, serialised as JSON. */
export async function sendRpc<Req, Res>(
  service: string,
  rpc: string,
  method: "GET" | "POST",
  request: Req,
): Promise<Res> {
  const response = await fetch(getRpcRoute(service, rpc), {
    method,
    body: JSON.stringify(request),
    headers: {
      [Header.ContentType]: ContentType.Json,
    },
  });
  // TODO: Error handling.
  if (!response.ok) {
    throw new Error(
      `RPC error: ${response.statusText} ${await response.text()}`,
    );
  }
  return JSON.parse(await response.text());
}

/** Returns the canonical route for an RPC. */
export function getRpcRoute(service: string, rpc: string): string {
  return `/api/${service}.${rpc}`;
}
