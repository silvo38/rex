import type { ContentType } from "./content_type.ts";
import { Header } from "./header.ts";
import { Status } from "./status.ts";
import { setCookie } from "@std/http/cookie";

/** The name of the Session ID cookie. */
export const SESSION_COOKIE = "SESSION";

/** Wrapper around the native Response class, with some convenience methods. */
export class RexResponse extends Response {
  /** Set the given header, in a fluent style. */
  setHeader(header: Header | string, value: string): RexResponse {
    this.headers.set(header, value);
    return this;
  }

  /** Returns the value of the requested header. */
  getHeader(header: Header | string): string | null {
    return this.headers.get(header);
  }

  /** Returns the value of the Content-Type header. */
  getContentType(): string | null {
    return this.getHeader(Header.ContentType);
  }

  /** Sets the Content-Type header. */
  setContentType(contentType: ContentType | string): RexResponse {
    return this.setHeader(Header.ContentType, contentType);
  }

  /** Returns the value of the Cache-Control header. */
  getCacheControl(): string | null {
    return this.getHeader(Header.CacheControl);
  }

  /** Sets the Cache-Control header. */
  setCacheControl(cacheControl: string): RexResponse {
    return this.setHeader(Header.CacheControl, cacheControl);
  }

  /** Sets the Cache-Control header to cache for one year. */
  setCacheable(): RexResponse {
    return this.setCacheControl("max-age=31536000, immutable");
  }

  /** Sets the Session cookie. */
  setSessionCookie(sessionId: string): RexResponse {
    setCookie(this.headers, { name: SESSION_COOKIE, value: sessionId });
    return this;
  }

  /** Returns the Session cookie. */
  getSessionCookie(): string | null {
    // WARNING! This just returns the full cookie. If we set other cookies, this
    // will fall apart.
    const value = this.getHeader(Header.SetCookie);
    if (value?.startsWith("SESSION=")) {
      return value.substring("SESSION=".length);
    }
    return value;
  }
}

/** Helpers for constructing standard HTTP responses. */
export abstract class Responses {
  static badRequest(message?: string): Response {
    return new Response(
      createErrorMessage(Status.BadRequest, "Bad Request", message),
      {
        status: Status.BadRequest,
      },
    );
  }

  static seeOther(location: string): Response {
    return new Response("", {
      status: Status.SeeOther,
      headers: { "location": location },
    });
  }

  static notFound(message?: string): Response {
    return new Response(
      createErrorMessage(Status.NotFound, "Not Found", message),
      {
        status: Status.NotFound,
      },
    );
  }

  static json(data: unknown): Response {
    return new Response(JSON.stringify(data), {
      status: Status.Ok,
      headers: {
        [Header.ContentType]: "application/json",
      },
    });
  }

  static ok(): Response {
    return new Response("", { status: Status.Ok });
  }
}

function createErrorMessage(
  status: Status,
  statusText: string,
  message?: string,
): string {
  if (message) {
    return `${status} ${statusText}: ${message}`;
  } else {
    return `${status} ${statusText}`;
  }
}
