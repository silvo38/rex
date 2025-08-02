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

For convenience, you can use the helper methods instead:

```ts
server
  .serveFile("/logo.svg", "static/logo.svg")
  .serveDirectory("/fonts", "static/fonts");
```

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

## Supplying flags / env variables

The `Flag` class gives you a type-safe way of accessing flags from the env.
There are some built-in subclasses for common primitives, or you can define your
own.

```ts
import { BoolFlag, StringFlag, validateFlags } from "rex";

// Whether to enable debugging. Defaults to true.
export const debugFlag = new BoolFlag("DEBUG", false);

// The filename of the database. Required.
export const databaseFlag = new StringFlag("DATABASE");

if (debugFlag.get()) {
  // ...
}
openDatabase(databaseFlag.get());

// In a unit test:
import { debugFlag } from "...";
debugFlag.setValueForTest(true);
```

Each flag should be defined once, at the top-level of a file. Flag values will
be validated when the `Server` instance is constructed.

You can use `.env` files, by specifiying them using the `--env-file` argument to
`deno run`, etc.:

```sh
deno run --allow-env --env-file=dev.env src/main.ts
```

For testing, it is recommended that you specify the value of the flag in your
test using `flag.setValueForTest(...)` rather than supplying a `.env` file
(although the latter is possible).

## Optional/recommended dependencies

### Ningen

The [Ningen](http://github.com/silvo38/ningen) build system is a convenient way
to compile JS/CSS files for your server. There are helper functions defined in
`src/build_defs.ts` to make it easy to run Tailwind and the Deno JS bundler.

Import them from your `BUILD.ts` file:

```ts
import { bundle, tailwind } from "jsr:@silvo38/rex@^0.0.3/build_defs.ts";
```

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
    --output dist/styles.css
```

If you are using the build system, there is a `tailwind` build rule provided in
`src/build_defs.ts` that you can import which will do this for you:

```ts
import { tailwind } from "jsr:@silvo38/rex@^0.0.3/build_defs.ts";

tailwind({
  srcs: "static/styles.css",
  out: "dist/styles.css",
});
```

This would generate `dist/styles.css`, which you would load in your page. Don't
forget to serve the CSS file using a `StaticFileHandler` or `serveFile`.

### Bundling and serving client-side JavaScript

Use the `bundle` rule to bundle your client JS using `deno bundle`. Point it at
the "entrypoint" file, and generate an output file, like so:

```ts
import { bundle } from "jsr:@silvo38/rex@^0.0.3/build_defs.ts";

bundle({
  srcs: "client/app.ts", // or .tsx
  out: ["dist/app.js"],
  deps: glob("client/**"),
});
```

This will generate `dist/app.js` and `dist/app.js.map`, which you can serve from
your server.

### Using client-side Preact

You can using Preact to render components on the client. Simply name your file
with a `.tsx` extension, and ensure you include this snippet in your `deno.json`
file:

```json
"compilerOptions": {
  "jsx": "react-jsx",
  "jsxImportSource": "preact"
}
```

You can call the `render` function manually where needed:

```ts
import { render } from "preact";

render(<MyComponent />, document.getElementById("example")!);
```

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

### Protobuf

There is very rudimentary support for protobuf using `ts-proto`. Install the
`protoc` compiler yourself, then use the `protobuf` Ningen function:

```ts
protobuf({
  srcs: "protos/simple.proto",
  out: "protos/simple.ts",
});
```

Don't forget to disable automatic formatting and linting for the generated files
in your `deno.json` file.

TODO: Design a very simple RPC system, using JSON as the wire format.

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
