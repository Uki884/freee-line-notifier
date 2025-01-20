import { Hono } from "hono";
import { Example } from "../../../view/features/Example/components/Example";
import { Layout } from "../../../view/layout/BaseLayout";

export const exampleRoute = new Hono().get("/", (c) => {
  return c.html(
    <Layout>
      <Example />
    </Layout>
  );
});
