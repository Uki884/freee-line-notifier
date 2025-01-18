import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { refreshAccessToken } from "../../lib/externalApi/freee/auth/refreshAccessToken";

export default new Hono().post(
  "/refreshToken",
  zValidator(
    "form",
    z.object({
      refreshToken: z.string(),
    }),
  ),
  async (c) => {
    const { refreshToken } = c.req.valid("form");

    const result = await refreshAccessToken({ refreshToken });

    return c.json(result);
  },
);
