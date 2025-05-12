import { type ContentType, inferContentType } from "./content_type.ts";
import type { Handler } from "./handler.ts";
import { Method } from "./method.ts";
import type { RexRequest } from "./request.ts";
import { RexResponse } from "./response.ts";

/** Serves a single static file. */
export class StaticFileHandler implements Handler {
  readonly method = Method.Get;
  readonly contentType: string | ContentType | null;
  /** The served route of the file. */
  readonly route: string;
  /** The filesystem path of the file. */
  readonly path: string;

  constructor(opts: {
    route: string;
    path: string;
    contentType?: string | ContentType;
  }) {
    this.route = opts.route;
    this.path = opts.path;
    this.contentType = opts.contentType ??
      inferContentType(getFileExtension(this.path));
    // Check that the file exists.
    // TODO: Can this be made async?
    Deno.statSync(this.path);
  }

  async handle(_request: RexRequest): Promise<RexResponse> {
    const bytes = await Deno.readFile(this.path);
    const response = new RexResponse(bytes);
    if (this.contentType) {
      response.setContentType(this.contentType);
    }
    return response;
  }
}

/**
 * Serves a directory of files.
 *
 * All of the files in `directory` on the filesystem will be served from the
 * given `route`. Content type will be inferred automatically.
 */
export class StaticDirectoryHandler implements Handler {
  readonly method = Method.Get;
  readonly route: string | URLPattern;
  readonly directory: string;

  constructor(opts: {
    route: string | URLPattern;
    directory: string;
  }) {
    this.route = opts.route;
    this.directory = opts.directory;
    // Check that the file exists.
    // TODO: Can this be made async?
    Deno.statSync(this.directory);
  }

  async handle(request: RexRequest): Promise<RexResponse> {
    const filename = request.path.substring(request.path.lastIndexOf("/") + 1);
    const path = `${this.directory}/${filename}`;
    const bytes = await Deno.readFile(path);
    const response = new RexResponse(bytes);

    // Infer the content type and return it.
    const contentType = inferContentType(getFileExtension(filename));
    if (contentType) {
      response.setContentType(contentType);
    }
    return response;
  }
}

function getFileExtension(filename: string) {
  return filename.substring(filename.lastIndexOf("."));
}
