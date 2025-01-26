import { MantineProvider } from "@mantine/core";
import type { ComponentType } from "react";

export function createHonoComponent<P extends object>(
  Component: ComponentType<P>,
) {
  return function WrappedComponent(props: P) {
    return (
      <MantineProvider>
        <Component {...props} />
      </MantineProvider>
    );
  };
}
