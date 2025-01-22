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
      CALLBACK_URL,
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
      redirectUri: CALLBACK_URL,
    });

    const { userId, displayName } = await lineApi.getProfile({
      accessToken: lineAccessToken,
    });

    await prisma.company.upsert({
      where: {
        companyId: company_id,
        lineUserId: userId,
      },
      update: {
        refreshToken: refresh_token,
        lineUserId: userId,
        name: displayName,
      },
      create: {
        companyId: company_id,
        refreshToken: refresh_token,
        name: displayName,
        lineUserId: userId,
      },
    });

    return c.json({ message: "success" });
  },
);
