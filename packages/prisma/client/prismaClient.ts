import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../output/edge";

export const getPrisma = (database_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
  }).$extends(withAccelerate());
  return prisma;
};
