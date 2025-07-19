import { RexRequest } from "rex";
import { ExampleBasePage } from "./ExampleBasePage.tsx";

/** Handler for the home page, served at `/`. */
export class HomePage extends ExampleBasePage {
  override route = "/";

  override render(_request: RexRequest) {
    return (
      <>
        {/* You can use Tailwind classes here. */}
        <h1 class="text-center text-5xl">Rex Example Server</h1>

        <img src="/icons/dog.png" />
      </>
    );
  }
}
