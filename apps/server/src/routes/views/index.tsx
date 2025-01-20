import { Hono } from "hono";
import exampleRoutes from "./example/index";

export const viewRoutes = new Hono().basePath("/");

viewRoutes.route("/examples", exampleRoutes);
