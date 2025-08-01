/** Common content types. */
export enum ContentType {
  Html = "text/html; charset=utf-8",
  JavaScript = "text/javascript",
  Jpeg = "image/jpeg",
  Json = "application/json",
  Png = "image/png",
  Svg = "image/svg+xml",
}

/** Infers ContentType from the given file extension. */
export function inferContentType(extension: string): ContentType | null {
  switch (extension) {
    case ".html":
      return ContentType.Html;
    case ".jpg":
      return ContentType.Jpeg;
    case ".js":
      return ContentType.JavaScript;
    case ".json":
      return ContentType.Json;
    case ".png":
      return ContentType.Png;
    case ".svg":
      return ContentType.Svg;
    default:
      return null;
  }
}
