import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { refreshAccessToken } from "../../lib/freeeApi/auth/refreshAccessToken";
import { envWithType } from "../../lib/hono/env";

export default new Hono().post(
  "",
  zValidator(
    "form",
    z.object({
      refreshToken: z.string(),
    }),
  ),
  async (c) => {
    const { refreshToken } = c.req.valid("form");
    const { FREEE_API_CLIENT_ID, FREEE_API_CLIENT_SECRET } = envWithType(c);
    const result = await refreshAccessToken({
      refreshToken,
      clientId: FREEE_API_CLIENT_ID,
      clientSecret: FREEE_API_CLIENT_SECRET,
    });

    return c.json(result);
  },
);
