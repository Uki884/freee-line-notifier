import { Hono } from "hono";
import { freeeRoutes } from "./freee";

export const app = new Hono();

export const apiRoutes = app
  .basePath("/api")
  .route("/freee", freeeRoutes);
