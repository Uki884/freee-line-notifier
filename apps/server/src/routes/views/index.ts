import { Hono } from "hono";
import { authRoutes } from "./auth";
import { exampleRoute } from "./example/index.page";
import { indexRoute } from "./index.page";

export const viewRoutes = new Hono().basePath("/");

viewRoutes.route("/", indexRoute);
viewRoutes.route("/examples", exampleRoute);
viewRoutes.route("/auth", authRoutes);
