import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getAccessToken } from "../../lib/externalApi/freee/auth/getAccessToken";
import { Bindings } from "../routes";

export default  new Hono<{ Bindings: Bindings }>().post(
  "/accessToken",
  zValidator(
    "form",
    z.object({
      code: z.string(),
    }),
  ),
  async (c) => {
    // const a = c.env.FREEE_API_CLIENT_ID;
    const { code } = c.req.valid("form");

    const result = await getAccessToken({ code });

    return c.json(result);
  },
);
