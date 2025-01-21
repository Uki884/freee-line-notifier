import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getAccessToken } from "../../lib/freeeApi/auth/getAccessToken";
import { getProfile } from "../../lib/lineApi/getProfile";
import { getPrismaClient } from "../../lib/prisma/client/prismaClient";

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
    const { CALLBACK_URL, FREEE_API_CLIENT_ID, FREEE_API_CLIENT_SECRET } =
      c.env;
    const prisma = getPrismaClient(c);

    const { freeeCode, lineAccessToken } = c.req.valid("form");

    const { company_id, refresh_token } = await getAccessToken({
      code: freeeCode,
      grantType: "authorization_code",
      clientId: FREEE_API_CLIENT_ID,
      clientSecret: FREEE_API_CLIENT_SECRET,
      redirectUri: CALLBACK_URL,
    });

    const { userId, displayName } = await getProfile({
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
