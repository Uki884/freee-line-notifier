import { Hono } from "hono";
import { registrationRoute } from "./registration";
import { transactionRoute } from "./transaction";

const app = new Hono();

const routes = app
  .route("/registration", registrationRoute)
  .route("/transaction", transactionRoute);

export type AppType = typeof routes;

export default app;
