import { Hono } from "hono";

import authRoutes from "./auth";
import companyRoutes from "./company";
import walletRoutes from "./wallet";

export const apiRoutes = new Hono().basePath("/api");

apiRoutes
  .route("/auth", authRoutes)
  .route("/companies", companyRoutes)
  .route("/wallets", walletRoutes);