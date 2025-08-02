import { ContentType, Header } from "@silvo38/rex";

/** Sends an RPC, serialised as JSON. */
export async function sendRpc<Req, Res>(
  service: string,
  rpc: string,
  method: "GET" | "POST",
  request: Req,
): Promise<Res> {
  const response = await fetch(`/api/${service}/${rpc}`, {
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
