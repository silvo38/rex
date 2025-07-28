/**
 * A type signature for React's createElement function. The Node generic arg is
 * a stand-in for the React VNode type.
 *
 * This typedef allows us not to actually depend on React or Preact or any
 * specific library, so clients can use any JSX implementation they like.
 */
// deno-lint-ignore no-explicit-any
type CreateElementFn<Node> = (type: any, props: any) => Node;

/** Type signature for React's render function. */
type RenderFn<Node> = (vnode: Node, parent: Element) => void;

/** Type signature for a component function. */
type ComponentFn<Props, Node> = (props: Props) => Node;

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
 * export const YourComponentIsland = defineIsland(YourComponent, createElement);
 *
 * // In your server render function:
 * <YourComponentIsland foo="abc" bar="xyz" />
 * ```
 */
export function defineIsland<Props, Node>(
  componentFn: ComponentFn<Props, Node>,
  createElement: CreateElementFn<Node>,
): (props: Props) => Node {
  const componentName = componentFn.name;
  return (props: Props) =>
    createElement("div", {
      "data-component": componentName,
      "data-props": encodeProps(props),
    });
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

/** Finds all usages of the given island type, and hydrates them. */
export function hydrateIslands<Props, Node>(
  componentFn: ComponentFn<Props, Node>,
  createElement: CreateElementFn<Node>,
  render: RenderFn<Node>,
) {
  const componentName = componentFn.name;
  document.querySelectorAll(`div[data-component="${componentName}"]`).forEach(
    (el) => {
      // TODO: Handle null/undefined props properly.
      const encodedProps = el.getAttribute("data-props") ?? "";
      const props = decodeProps(encodedProps) as Props;
      // WARNING! You can't use componentFn(props) here, because that is not
      // a real Preact element. It must be created using the createElement
      // function.
      const component = createElement(componentFn, props);
      render(component, el);
    },
  );
}

/**
 * Helper function that lets you bind the React arguments once.
 *
 * The returned value is a function that will hydrate the given component type.
 * Usage:
 *
 * ```
 * const hydrateIslands = getIslandHydrater(React.createElement, React.render);
 * hydrateIslands(MySpecialComponent);
 * ```
 */
export function getIslandHydrater<Props, Node>(
  createElement: CreateElementFn<Node>,
  render: RenderFn<Node>,
): (componentFn: ComponentFn<Props, Node>) => void {
  return (componentFn) => hydrateIslands(componentFn, createElement, render);
}
