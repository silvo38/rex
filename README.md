# Rex: Deno server framework

A straightforward server framework built around `Deno.serve()`.

The principles are to be simple and explicit. This means no implicit
filesystem-based routing. It also follows the Deno philosophy of staying true to
browser APIs, so we will try to stick to the standard `Request` and `Response`
APIs where feasible (perhaps with a few extra additions for convenience).

## Basic usage

```tsx
import { renderHtml, RexRequest, Routes, Server } from "rex";

function renderHomePage() {
  return renderHtml(<h1>Home page</h1>);
}

function getPost(request: RexRequest): RexResponse {
  return new Response(`This is post ${request.params.id}`);
}

const server = new Server();

// Define all of your routes. You can use a mixture of path strings (with slugs)
// or provide your own URLPattern instances.
server.addRoutes([
  { path: "/home", handler: renderHomePage },
  { path: "/post/:id", handler: getPost },
]);

Deno.serve((request) => server.handle(request));
```

## Request and Response wrappers

The framework uses custom wrapper classes called `RexRequest` and `RexResponse`,
which provide additional helper methods for convenience. They extend the native
`Request` and `Response` classes, so you don't have to use the additional
functionality if you don't want to, but it does make some things easier.
