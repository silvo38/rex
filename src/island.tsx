import type { VNode } from "preact";

/**
 * Defines a new placeholder type for an island. Call this from your server
 * rendering function. It will be hydrated by the client.
 *
 * Usage:
 *
 * ```
 * function YourComponent({foo, bar}: YourComponentProps) {
 *   return <div>...</div>
 * }
 *
 * export const YourComponentIsland = defineIsland(YourComponent);
 *
 * // In your server render function:
 * <YourComponentIsland foo="abc" bar="xyz" />
 * ```
 */
export function defineIsland<Props>(
  componentType: (props: Props) => VNode,
): (props: Props) => VNode {
  const componentName = componentType.name;
  return (props: Props) => (
    <div data-component={componentName} data-props={encodeProps(props)} />
  );
}

/**
 * Encodes the given props as a string that is safe to embed in an HTML
 * attribute value. Props must be JSON-able.
 */
export function encodeProps(props: unknown): string {
  return encodeURIComponent(JSON.stringify(props));
}

/** Decodes encoded props back to the raw props type. */
export function decodeProps<Props>(encodedProps: string): Props {
  return JSON.parse(decodeURIComponent(encodedProps));
}
