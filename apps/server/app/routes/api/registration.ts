import { FreeePublicApi } from "@freee-line-notifier/external-api/freee";
import { LineApi } from "@freee-line-notifier/external-api/line";
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
      code: z.string(),
    }),
  ),
  async (c) => {
    const {
      LINE_LIFF_AUTH_URL,
      FREEE_API_CLIENT_ID,
      FREEE_API_CLIENT_SECRET,
      DATABASE_URL,
    } = c.env;
    const authorization = c.get("accessToken");

    const prisma = getPrisma(DATABASE_URL);

    const { code } = c.req.valid("form");
    const lineApi = new LineApi({ accessToken: authorization });
    const freeeApi = new FreeePublicApi();

    const { company_id, refresh_token } = await freeeApi.getAccessToken({
      code,
      grantType: "authorization_code",
      clientId: FREEE_API_CLIENT_ID,
      clientSecret: FREEE_API_CLIENT_SECRET,
      redirectUri: LINE_LIFF_AUTH_URL,
    });

    const { userId: lineUserId, displayName } = await lineApi.getProfile();

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
      include: {
        companies: true,
      },
    });

    // 既に会社が登録済みの場合は全て無効化にして新規登録される会社のみがactiveになるようにする
    if (user.companies.length > 0) {
      await prisma.company.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          status: "inactive",
        },
      });
    }

    await prisma.company.upsert({
      where: {
        companyId: company_id,
      },
      update: {
        refreshToken: refresh_token,
        status: "active",
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
