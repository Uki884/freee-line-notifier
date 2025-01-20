import { Hono } from "hono";

import accessTokenRoute from "./accessToken.route";
import authorizeRoute from "./authorize.route";
import callbackRoute from "./callback.route";
import refreshTokenRoute from "./refreshToken.route";

export default new Hono()
  .route("/authorize", authorizeRoute)
  .route("/callback", callbackRoute)
  .route("/accessToken", accessTokenRoute)
  .route("/refreshToken", refreshTokenRoute);

