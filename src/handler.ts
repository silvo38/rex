import { RexRequest } from "./request.ts";

/** Handles a route, by returning a Response. Can be async. */
export type Handler = (request: RexRequest) => Response | Promise<Response>;
