import { createClient } from "honox/client";

createClient({
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  hydrate: async (elem: any, root) => {
    const { hydrateRoot } = await import("react-dom/client");
    hydrateRoot(root, elem);
  },
  createElement: async (type, props) => {
    const { createElement } = await import("react");
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return createElement(type, props) as any;
  },
});
