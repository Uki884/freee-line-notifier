import build from "@hono/vite-cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import honox from "honox/vite";

import { defineConfig } from "vite";

export default defineConfig({
  ssr: {
    external: ["@prisma/client"],
  },
  plugins: [honox({ devServer: { adapter } }), build()],
});
