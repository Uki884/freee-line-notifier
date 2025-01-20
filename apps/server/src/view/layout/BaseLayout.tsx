import type { PropsWithChildren } from "hono/jsx";

export const Layout = (props: PropsWithChildren) => {
  return (
    <html lang="ja">
      <meta charSet="utf-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <title>hono-client</title>
      <body>{props.children}</body>
    </html>
  );
};
