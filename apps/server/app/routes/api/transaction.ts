import { freeeApi } from "@freee-line-notifier/external-api/freee";
import { getPrisma } from "@freee-line-notifier/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

export const transactionRoute = app.get(
  "/:id",
  zValidator(
    "query",
    z.object({
      companyId: z.string().transform(Number),
    }),
  ),
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const { FREEE_API_CLIENT_ID, FREEE_API_CLIENT_SECRET, DATABASE_URL } =
      c.env;

    const { id } = c.req.valid("param");
    const { companyId } = c.req.valid("query");

    try {

    const prisma = getPrisma(DATABASE_URL);

    const company = await prisma.company.findUniqueOrThrow({
      where: {
        companyId,
      },
    });

    const accessToken = await freeeApi.refreshAccessToken({
      refreshToken: company.refreshToken,
      clientId: FREEE_API_CLIENT_ID,
      clientSecret: FREEE_API_CLIENT_SECRET,
    });

    await prisma.company.update({
      where: {
        id: company.id,
      },
      data: {
        refreshToken: accessToken.refresh_token,
      },
    });

    const result = await freeeApi.getWalletTxn({
      id: Number(id),
      companyId: company.companyId,
      accessToken: accessToken.access_token,
    });
    return c.json({ result });
  } catch {
    return c.json({ result: 'エラー' }, 500);
  }
  }
);
