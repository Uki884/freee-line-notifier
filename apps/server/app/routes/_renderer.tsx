import { reactRenderer } from "@hono/react-renderer";
import { ColorSchemeScript } from "@mantine/core";
import { Script } from "honox/server";

export default reactRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Script src="/static/client.js" async />
        <link href="/static/assets/styles.css" rel="stylesheet" />
        <ColorSchemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
});
