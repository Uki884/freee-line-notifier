import { Hono } from "hono";

import accessTokenRoute from "./accessToken.route";
import authorizeRoute from "./authorize.route";
import companyRoutes from "./company";

export const freeeRoutes = new Hono()
  .route("/authorize", authorizeRoute)
  .route("/accessToken", accessTokenRoute)
  .route("/campanies", companyRoutes);
