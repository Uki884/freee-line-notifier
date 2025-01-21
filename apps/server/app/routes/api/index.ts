import { Hono } from "hono";
import { registrationRoute } from "./registration";

const app = new Hono();

app.route("/registration", registrationRoute);

export type AppType = typeof app;

export default app;
