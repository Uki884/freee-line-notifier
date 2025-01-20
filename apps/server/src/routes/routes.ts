import { Hono } from "hono";
import type { Bindings } from "../lib/hono/types";
import { apiRoutes } from "./api";
import { viewRoutes } from "./views";

export const app = new Hono<{ Bindings: Bindings }>();

app.route("/", apiRoutes);
app.route("/", viewRoutes);