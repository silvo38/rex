import { ContentType, Header } from "./header.ts";
import { Status } from "./status.ts";

/** Wrapper around the native Response class, with some convenience methods. */
export class RexResponse extends Response {

  /** Returns the value of the Content-Type header. */
  getContentType(): string | null {
    return this.headers.get(Header.ContentType);
  }

  /** Sets the Content-Type header. */
  setContentType(contentType: ContentType | string): RexResponse {
    this.headers.set(Header.ContentType, contentType);
    return this;
  }
}

/** Helpers for constructing standard HTTP responses. */
export abstract class Responses {
  static badRequest(message?: string) {
    return new Response(
      createErrorMessage(Status.BadRequest, "Bad Request", message),
      {
        status: Status.BadRequest,
      },
    );
  }

  static seeOther(location: string) {
    return new Response("", {
      status: Status.SeeOther,
      headers: { "location": location },
    });
  }

  static notFound(message?: string) {
    return new Response(
      createErrorMessage(Status.NotFound, "Not Found", message),
      {
        status: Status.NotFound,
      },
    );
  }

  static json(data: unknown) {
    return new Response(JSON.stringify(data), {
      status: Status.Ok,
      headers: {
        [Header.ContentType]: "application/json",
      },
    });
  }

  static ok() {
    return new Response("", { status: Status.Ok });
  }
}

function createErrorMessage(
  status: Status,
  statusText: string,
  message?: string,
) {
  if (message) {
    return `${status} ${statusText}: ${message}`;
  } else {
    return `${status} ${statusText}`;
  }
}
