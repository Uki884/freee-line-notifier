import { Hono } from "hono";

import accessTokenRoute from "./accessToken.route";
import authorizeRoute from "./authorize.route";

export default new Hono()
  .route("/authorize", authorizeRoute)
  .route("/accessToken", accessTokenRoute)

