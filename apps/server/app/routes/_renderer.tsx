import { reactRenderer } from "@hono/react-renderer";
import { ColorSchemeScript } from "@mantine/core";

export default reactRenderer(({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {import.meta.env.PROD ? (
          <script type="module" src="/static/client.js" />
        ) : (
          <script type="module" src="/app/client.ts" />
        )}
        {import.meta.env.PROD ? (
          <link href="/static/assets/styles.css" rel="stylesheet" />
        ) : (
          <link href="/static/assets/styles.css" rel="stylesheet" />
        )}
        <ColorSchemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
});
