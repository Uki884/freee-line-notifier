import { freeeApi } from "@freee-line-notifier/external-api/freee";
import { lineApi } from "@freee-line-notifier/external-api/line";
import { getPrisma } from "@freee-line-notifier/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

export const registrationRoute = app.post(
  "/",
  zValidator(
    "form",
    z.object({
      freeeCode: z.string(),
      lineAccessToken: z.string(),
    }),
  ),
  async (c) => {
    const {
      LINE_LIFF_AUTH_URL,
      FREEE_API_CLIENT_ID,
      FREEE_API_CLIENT_SECRET,
      DATABASE_URL,
    } = c.env;

    const prisma = getPrisma(DATABASE_URL);

    const { freeeCode, lineAccessToken } = c.req.valid("form");

    const { company_id, refresh_token } = await freeeApi.getAccessToken({
      code: freeeCode,
      grantType: "authorization_code",
      clientId: FREEE_API_CLIENT_ID,
      clientSecret: FREEE_API_CLIENT_SECRET,
      redirectUri: LINE_LIFF_AUTH_URL,
    });

    const { userId: lineUserId, displayName } = await lineApi.getProfile({
      accessToken: lineAccessToken,
    });

    const user = await prisma.user.upsert({
      where: {
        lineUserId: lineUserId,
      },
      update: {
        name: displayName,
      },
      create: {
        lineUserId: lineUserId,
        name: displayName,
      },
    });

    await prisma.company.upsert({
      where: {
        companyId: company_id,
      },
      update: {
        refreshToken: refresh_token,
      },
      create: {
        userId: user.id,
        companyId: company_id,
        refreshToken: refresh_token,
      },
    });

    return c.json({ message: "success" });
  },
);
