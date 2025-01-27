import {
  FreeePrivateApi,
  FreeePublicApi,
} from "@freee-line-notifier/external-api/freee";
import { getPrisma } from "@freee-line-notifier/prisma";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { createRoute } from "honox/factory";
import { z } from "zod";

export default createRoute(
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
    const currentUser = c.get("currentUser");

    const { companyId } = c.req.valid("query");

    try {
      const prisma = getPrisma(DATABASE_URL);
      const company = currentUser?.companies.find(
        (compamy) => compamy.companyId === companyId,
      );

      if (!company) {
        throw new HTTPException(401, {
          message: "事業所が見つかりませんでした",
        });
      }

      const publicApi = new FreeePublicApi();

      const accessToken = await publicApi.refreshAccessToken({
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

      const privateApi = new FreeePrivateApi({
        accessToken: accessToken.access_token,
      });

      const result = await privateApi.getWalletTxn({
        id: Number(id),
        companyId: company.companyId,
      });

      return c.json({ result });
    } catch {
      return c.json({ result: "エラー" }, 500);
    }
  },
);
