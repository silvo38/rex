import * as _Preact from "preact";

// TODO!!!! Move this to a library somewhere.

/** Decodes encoded props back to the raw props type. */
export function decodeProps<Props>(encodedProps: string): Props {
  return JSON.parse(decodeURIComponent(encodedProps));
}

/** Finds all usages of the given island type, and hydrates them. */
export function hydrateIslands<Props>(
  componentType: (props: Props) => _Preact.JSX.Element,
) {
  const componentName = componentType.name;
  document.querySelectorAll(`div[data-component="${componentName}"]`).forEach(
    (el) => {
      // TODO: Handle null/undefined props properly.
      const encodedProps = el.getAttribute("data-props") ?? "";
      const props = decodeProps(encodedProps) as Props;
      const component = componentType(props);
      _Preact.render(component, el);
    },
  );
}
