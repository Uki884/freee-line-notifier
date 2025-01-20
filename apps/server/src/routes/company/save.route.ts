import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getPrismaClient } from "../../lib/prisma/client/prismaClient";

export default new Hono().put(
  "/save",
  zValidator(
    "form",
    z.object({
      companyId: z.string(),
      refreshToken: z.string(),
    }),
  ),
  async (c) => {
    const { companyId, refreshToken } = c.req.valid("form");
    const prisma = getPrismaClient(c);

    await prisma.company.upsert({
      where: {
        companyId,
      },
      update: {
        refreshToken,
        name: companyId,
      },
      create: {
        companyId,
        refreshToken,
        name: companyId,
      },
    });

    return c.json({}, 201);
  },
);
