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
      // WARNING! You can't use componentType(props) here, because that is not
      // a real Preact element. It must be created using the h() function.
      _Preact.render(_Preact.h(componentType, props as unknown as any), el);
    },
  );
}
