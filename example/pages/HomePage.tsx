import { type RexRequest, StringFlag } from "rex";
import { ExampleBasePage } from "./ExampleBasePage.tsx";

// Define a flag, whose value is specified in the .env file.
const myNameFlag = new StringFlag("MY_NAME", "Default Name");

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
      </>
    );
  }
}
