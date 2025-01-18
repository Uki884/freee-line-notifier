import { authHandler, verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import { except } from "hono/combine";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authRoutes } from "./auth";
import { exampleRoutes } from "./example";

export const app = new Hono();

app.use("*", authMiddleware);

app.use(
  "/api/auth/*",
  except(["/api/auth/signUp", "/api/auth/authUser"], authHandler()),
);

app.use("/api/*", except(["/api/auth/signUp"], verifyAuth()));

export const apiRoutes = app
  .basePath("/api")
  .route("/examples", exampleRoutes)
  .route("/auth", authRoutes);
