# Command line tools

## RPC Generator

Generates client and server RPC definitions from a JSON service config.

```sh
deno run -A rex/tools/rpc_generator.ts path/to/service.json
```

Create a JSON file with your service definition, like so:

```json
{
  "service": "GreetingService",
  "importMap": {
    "./schema.ts": ["HelloRequest", "HelloResponse"]
  },
  "rpcs": [
    {
      "name": "sayHello",
      "method": "GET",
      "request": "HelloRequest",
      "response": "HelloResponse"
    }
  ]
}
```
