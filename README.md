# Rex: Deno server framework

A straightforward server framework built around `Deno.serve()`.

The principles are to be simple and explicit. This means no implicit
filesystem-based routing. It also follows the Deno philosophy of staying true to
browser APIs, so we will try to stick to the standard `Request` and `Response`
APIs where feasible (perhaps with a few extra additions for convenience).

## Basic usage

```tsx
import { PageHandler, RexRequest, Routes, Server } from "rex";

// A page handler, which renders HTML.
class HomePage extends PageHandler {
  // Responds to a specific route.
  readonly route = "/";

  override async render(request: RexRequest) {
    return <h1>Home</h1>;
  }
}

// A custom endpoint.
class GetPostHandler implements Handler {
  // Routes can use slugs. This can be a string or a URLPattern.
  readonly route = "/post/:id";

  handle(request: RexRequest): RexResponse {
    return new Response(`This is post ${request.params.id}`);
  }
}

const server = new Server()
  .addHandler(new HomePage())
  .addHandler(new GetPostHandler());

// You are responsible for starting and controlling the Deno server.
Deno.serve((request) => server.handle(request));
```

## Request and Response wrappers

The framework uses custom wrapper classes called `RexRequest` and `RexResponse`,
which provide additional helper methods for convenience. They extend the native
`Request` and `Response` classes, so you don't have to use the additional
functionality if you don't want to, but it does make some things easier.

## Handlers

The basic API of Rex is the `Handler` interface. This is an object that has a
`route` field, indicating the route(s) it should handle, and a `handle` method,

## Serving static assets

You can serve an entire directory of files using `StaticDirectoryHandler`, or a
single file using `StaticFileHandler`, like so:

```ts
import { StaticDirectoryHandler, StaticFileHandler } from "rex";

const server = new Server()
  .addHandler(
    new StaticFileHandler({
      route: "/logo.svg",
      path: "static/logo.svg",
    }),
  )
  .addHandler(
    new StaticDirectoryHandler({
      route: "/fonts/*",
      directory: "static/fonts",
    }),
  );
```

Be sure to add handlers for more specific routes earlier (e.g. if you wanted to
serve a different file at `/fonts/Roboto.ttf`, make sure you add a
`StaticFileHandler` for that route first, before adding a handler for
`/fonts/*`).

## Rendering HTML

Rex uses Preact to render JSX components as HTML. For this, define a subclass of
`PageHandler`, and implement the `render` method:

```tsx
import { PageHandler, RexRequest } from "rex";

class HomePage extends PageHandler {
  readonly route = "/";

  override async render(request: RexRequest) {
    return <h1>Home</h1>;
  }
}

const server = new Server().addHandler(new HomePage());
```

Often, you will want to use a template for your main page HTML, and render a
smaller component inside it. For this, you can override the `layoutPage` method.
Usually you would define an abstract subclass of `PageHandler` with your page
template, and use that throughout your app, e.g.:

```tsx
import { PageHandler, RexRequest } from "rex";

abstract class MyBasePage extends PageHandler {
  override layoutPage(component: VNode): VNode {
    // This template is applied to every page.
    return (
      <html>
        <head>...</head>
        <body>{component}</body>
      </html>
    );
  }
}

class HomePage extends MyBasePage {
  readonly route = "/";

  override async render(request: RexRequest) {
    // This gets rendered inside the <body>.
    return <h1>Home</h1>;
  }
}
```

## Optional/recommended dependencies

### Tailwind

There is no special integration of Tailwind in Rex; however, it is very easy to
add yourself. All that is required is to run the Tailwind CLI as part of your
build process.

For instance, using the Just command runner, you could add the following to your
`justfile`:

```
tailwind:
  deno run -A npm:@tailwindcss/cli@^4.1.7 \
    --input static/styles.css \
    --output static/styles.gen.css
```

This would generate `styles.gen.css`, which you would load in your page. Don't
forget to serve the CSS file using a `StaticFileHandler`.

### Dependency injection

Using the [inject](https://github.com/silvo38/inject) library can help simplify
creating handler instances.

```ts
import { inject } from "inject";

class MyHandler implements Handler {
  readonly route = "/post/:id";

  private readonly database = inject(MyDatabase);

  handle(request: RexRequest): RexResponse {
    const name = this.database.getNameFromId(request.params.id);
    return new Response(`Name: ${name}`);
  }
}
```

## Testing

The `rex/testing` package contains lots of helpers for unit testing your
handlers or server. In particular, `testHandler` is useful for testing a handler
in isolation.

```ts
import { assertOk, testHandler } from "rex/testing";

Deno.test("MyHandler responds with OK", async () => {
  const response = await testHandler(new MyHandler(), "/icons/add.svg");
  assertOk(response);
});
```
