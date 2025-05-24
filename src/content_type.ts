/** Common content types. */
export enum ContentType {
  Html = "text/html; charset=utf-8",
  Jpeg = "image/jpeg",
  Svg = "image/svg+xml",
}

/** Infers ContentType from the given file extension. */
export function inferContentType(extension: string): ContentType | null {
  switch (extension) {
    case ".html":
      return ContentType.Html;
    case ".jpg":
      return ContentType.Jpeg;
    case ".svg":
      return ContentType.Svg;
    default:
      return null;
  }
}
