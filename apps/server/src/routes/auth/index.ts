import { Hono } from "hono";

import accessTokenRoute from "./accessToken.route";
import authorizeRoute from "./authorize.route";
import refreshTokenRoute from "./refreshToken.route";

export default new Hono()
  .route("", authorizeRoute)
  .route("", accessTokenRoute)
  .route("", refreshTokenRoute);
