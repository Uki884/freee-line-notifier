import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { envWithType } from "../../lib/hono/env";
import { Redirect } from "../../view/features/Line/components/Redirect";
import { Layout } from "../../view/layout/BaseLayout";

const index = new Hono();

export const indexRoute = index.get("/", (c) => {
  const { LINE_LIFF_ID } = envWithType(c);

  return c.html(
    <Layout>
      <Redirect liffId={LINE_LIFF_ID} />
    </Layout>,
  );
});
