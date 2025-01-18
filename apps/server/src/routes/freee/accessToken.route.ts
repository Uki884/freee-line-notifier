import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getAccessToken } from "../../lib/externalApi/freee/auth/getAccessToken";

export default new Hono().post("",
  zValidator(
    "form",
    z.object({
      code: z.string(),
    }),
  ), async (c)=> {
    const { code } = c.req.valid('form');

  const result = await getAccessToken({ code });

  console.log("result", result);

  return c.json(result);
})


