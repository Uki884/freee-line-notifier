import { Hono } from "hono";
import { except } from "hono/combine";
import { companyAuthMiddleware } from "../../middlewares/companyAuthMiddleware";
import { currentUserMiddleware } from "../../middlewares/currentUserMiddleware";
import { lineAuthMiddleware } from "../../middlewares/lineAuthMiddleware";
import { registrationRoute } from "./registration";
import { transactionRoute } from "./transaction";

const app = new Hono();

app.use("/", lineAuthMiddleware);
app.get("/link/wallet_txn", (c) => {
  return c.redirect("freee://wallet_txn");
});

app.use(
  "/",
  except("/registration", currentUserMiddleware, companyAuthMiddleware),
);

const routes = app
  .route("/registration", registrationRoute)
  .route("/transaction", transactionRoute);

export type AppType = typeof routes;

export default app;
