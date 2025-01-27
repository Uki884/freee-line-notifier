import { Hono } from "hono";
import { except } from "hono/combine";
import { companyAuthMiddleware } from "../../middlewares/companyAuthMiddleware";
import { currentUserMiddleware } from "../../middlewares/currentUserMiddleware";
import { lineAuthMiddleware } from "../../middlewares/lineAuthMiddleware";
import { registrationRoute } from "./registration";

const app = new Hono();

app.use("/", lineAuthMiddleware);
app.use(
  "/",
  except(
    "/registration",
    currentUserMiddleware,
    companyAuthMiddleware,
  ),
);

const routes = app
  .route("/registration", registrationRoute)

export type AppType = typeof routes;

export default app;
