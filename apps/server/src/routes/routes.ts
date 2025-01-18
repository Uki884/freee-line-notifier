
import { authHandler, verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import { except } from "hono/combine";
import { authMiddleware } from "../middlewares/auth.middleware";
import { exampleRoutes } from "./example";
import { freeeRoutes } from "./freee";

export const app = new Hono();

// app.use("*", authMiddleware);

// app.use(
//   "/api/auth/*",
//   except(["/api/auth/signUp", "/api/auth/authUser"], authHandler()),
// );

// app.use("/api/*", except(["/api/auth/signUp"], verifyAuth()));

// app.get("/authorize", (c)=> {
//   const state = randomBytes(32).toString("hex");
//   return c.redirect(`${process.env.FREEE_API_URL}/public_api/authorize?response_type=code&client_id=${process.env.FREEE_API_CLIENT_ID}&redirect_uri=${process.env.APP_URL}&state=${state}&prompt=select_company`)
// })

export const apiRoutes = app
  .basePath("/api")
  .route("/freee", freeeRoutes);
