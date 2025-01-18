import { Hono } from "hono";
import authRoutes from "./auth";
import companyRoutes from "./company";

export const app = new Hono();

export const apiRoutes = app
  .basePath("/api")
  .route("/auth", authRoutes)
  .route("/companies", companyRoutes)
