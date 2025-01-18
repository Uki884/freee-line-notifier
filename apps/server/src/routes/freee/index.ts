import { Hono } from "hono";

import authRoutes from "./auth";
import companyRoutes from "./company";

export const freeeRoutes = new Hono()
  .route("/auth", authRoutes)
  .route("/companies", companyRoutes);

