import { GreetingServiceClient } from "../gen/greeting_service_client.ts";

// Example of how to call an RPC from the client.
export async function callGreetingRpc() {
  const client = new GreetingServiceClient();
  const response = await client.sayHello({ name: "Cam" });
  console.log(response.message);
}
