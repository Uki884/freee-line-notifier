import { Hono } from "hono";
import { registrationRoute } from "./registration";

const app = new Hono<{
  Bindings: {
    LINE_CHANNEL_ACCESS_TOKEN: string;
    LINE_CHANNEL_SECRET: string;
  };
}>();

app.route("/registration", registrationRoute);

export type AppType = typeof app;

export default app;
