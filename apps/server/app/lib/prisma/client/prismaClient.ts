import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import type { Context } from "hono";
import { envWithType } from "../../hono/env";

export const getPrisma = (database_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
  }).$extends(withAccelerate());
  return prisma;
};

export const getPrismaClient = (c: Context) => {
  const { DATABASE_URL } = envWithType(c);
  return getPrisma(DATABASE_URL);
};
