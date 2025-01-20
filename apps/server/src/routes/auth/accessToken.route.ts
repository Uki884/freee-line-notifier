import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getAccessToken } from "../../lib/externalApi/freee/auth/getAccessToken";
import { envWithType } from "../../lib/hono/env";

export default new Hono().post(
  "",
  zValidator(
    "form",
    z.object({
      code: z.string(),
    }),
  ),
  async (c) => {
    const { code } = c.req.valid("form");
    const { APP_URL, FREEE_API_CLIENT_ID, FREEE_API_CLIENT_SECRET } =
      envWithType(c);

    const result = await getAccessToken({
      code,
      grantType: "authorization_code",
      clientId: FREEE_API_CLIENT_ID,
      clientSecret: FREEE_API_CLIENT_SECRET,
      redirectUri: `${APP_URL}/callback/freee`,
    });

    return c.json(result);
  },
);
