/** Matched route params, e.g. `/post/:id` might give `{id: 'abc'}`. */
type Params = Readonly<Record<string, string | undefined>>;

export class RexRequest extends Request {
  /** Decoded route params, from the route that matched this request. */
  readonly params: Params;

  /** The request URL, parsed for convenience. */
  readonly location: URL;

  constructor(request: Request, params: Params) {
    super(request);
    this.location = new URL(request.url);
    this.params = params;
  }

  /** The pathname, as a string. */
  get path(): string {
    return this.location.pathname;
  }

  /**
   * Creates a new instance. Requires the initial Request instance, and the
   * result of matching the request against a route.
   */
  static create(request: Request, match?: URLPatternResult) {
    return new RexRequest(request, match?.pathname?.groups ?? {});
  }
}
