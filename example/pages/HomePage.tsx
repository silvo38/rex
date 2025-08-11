import { type RexRequest, StringFlag } from "rex";
import { ExampleBasePage } from "./ExampleBasePage.tsx";
import { CounterIsland } from "../client/Counter.tsx";
import { assets } from "../src/assets.ts";

// Define a flag, whose value is specified in the .env file.
const myNameFlag = new StringFlag("MY_NAME", "Default Name");

/** Data produced by the `load` method and needed by the `render` method. */
interface HomePageData {
  name: string;
}

/** Handler for the home page, served at `/`. */
export class HomePage extends ExampleBasePage<HomePageData> {
  override route = "/";

  override load(_request: RexRequest): HomePageData {
    // Business logic should go here. All data needed for rendering should be
    // returned.
    return {
      name: myNameFlag.get(),
    };
  }

  override render(data: HomePageData, _request: RexRequest) {
    return (
      <>
        {/* You can use Tailwind classes here. */}
        <h1 class="text-center text-5xl">Rex Example Server</h1>

        <img src={assets.dogIcon.url()} />

        <p>Hi, {data.name}</p>

        {/* This is an interactive component, rendered client-side. */}
        <CounterIsland startingValue={100} />
      </>
    );
  }
}
