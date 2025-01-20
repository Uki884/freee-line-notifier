import { Hono } from "hono";
import { Layout } from "../../../view/layout/BaseLayout";

export const callbackRoute = new Hono().get("/", (c) => {
  return c.html(
    <Layout>
      <h1>Hello World</h1>
    </Layout>
  );
});
