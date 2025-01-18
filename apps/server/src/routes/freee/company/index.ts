import { Hono } from "hono";

import indexRoute from "./index.route";

export default new Hono()
  .route("/", indexRoute)
