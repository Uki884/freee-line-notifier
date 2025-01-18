import { COOKIE_NAMES } from "@app/constants";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { z } from "zod";
import { getAccessToken } from "../../lib/externalApi/freee/auth/getAccessToken";

export default new Hono().post(
  "/accessToken",
  zValidator(
    "form",
    z.object({
      code: z.string(),
    }),
  ),
  async (c) => {
    const { code } = c.req.valid("form");

    const result = await getAccessToken({ code });

    return c.json(result);
  },
);
