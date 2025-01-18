import { Hono } from "hono";

import { indexRoute } from "./index.route";
import { newRoute } from "./new.route";
import { showRoute } from "./show.route";

export const exampleRoutes = new Hono()
  .route("/", indexRoute)
  .route("/new", newRoute)
  .route("/:id", showRoute);
