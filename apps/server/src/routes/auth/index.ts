import { Hono } from "hono";

import { authUserRoute } from "./authUser.route";
import { signUpRoute } from "./signUp.route";

export const authRoutes = new Hono()
  .route("/signUp", signUpRoute)
  .route("/authUser", authUserRoute);
