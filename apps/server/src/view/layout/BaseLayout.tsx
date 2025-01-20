import type { PropsWithChildren } from "hono/jsx";

export const Layout = (props: PropsWithChildren) => {
  return (
    <html lang="ja">
      <body>{props.children}</body>
    </html>
  );
};
