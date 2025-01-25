import { Hono } from "hono";
import { lineAuthMiddleware } from "../../middlewares/lineAuthMiddleware";
import { registrationRoute } from "./registration";
import { transactionRoute } from "./transaction";

const app = new Hono();

app.use('*', lineAuthMiddleware)

const routes = app
  .route("/registration", registrationRoute)
  .route("/transaction", transactionRoute);

export type AppType = typeof routes;

export default app;
