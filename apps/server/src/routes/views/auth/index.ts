import { Hono } from "hono";
import { callbackRoute } from "./callback.page";

export const authRoutes = new Hono().basePath("/auth");

authRoutes.route("/callback", callbackRoute);
