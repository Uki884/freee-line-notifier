import { Hono } from "hono";
import type { Bindings } from "../lib/hono/types";
import { getPrismaClient } from "../lib/prisma/client/prismaClient";
import authRoutes from "./auth";
import companyRoutes from "./company";

export const app = new Hono<{ Bindings: Bindings }>();

export const apiRoutes = app
  .basePath("/api")
  .route(
    "/examples",
    new Hono().get("/", async (c) => {
      const prisma = getPrismaClient(c);
      const companies = await prisma.company.findMany();

      return c.json({
        result: companies,
      });
    }),
  )
  .route("/auth", authRoutes)
  .route("/companies", companyRoutes);
