import { Hono } from "hono";
import authRoutes from "./auth";
import companyRoutes from "./company";

export type Bindings = {
  DATABASE_URL: string
  FREEE_PUBLIC_API_URL: string
  FREEE_API_URL: string
  FREEE_API_CLIENT_ID: string
  FREEE_API_CLIENT_SECRET: string
  APP_URL: string
}

export const app = new Hono<{ Bindings: Bindings }>();

export const apiRoutes = app
  .basePath("/api")
  .route("/auth", authRoutes)
  .route("/companies", companyRoutes)
