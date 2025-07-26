import { defineIsland, type RexRequest, StringFlag } from "rex";
import { ExampleBasePage } from "./ExampleBasePage.tsx";
import { Counter } from "../client/Counter.tsx";

// Define a flag, whose value is specified in the .env file.
const myNameFlag = new StringFlag("MY_NAME", "Default Name");

// TODO: Put this somewhere else?
export const CounterIsland = defineIsland(Counter);

/** Handler for the home page, served at `/`. */
export class HomePage extends ExampleBasePage {
  override route = "/";

  override render(_request: RexRequest) {
    return (
      <>
        {/* You can use Tailwind classes here. */}
        <h1 class="text-center text-5xl">Rex Example Server</h1>

        <img src="/icons/dog.png" />

        <p>Hi, {myNameFlag.get()}</p>

        {/* This is an interactive component, rendered client-side. */}
        <CounterIsland startingValue={100} />
      </>
    );
  }
}
