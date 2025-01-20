import { getAccessToken } from "../../lib/freeeApi/auth/getAccessToken";
import { envWithType } from "../../lib/hono/env";
import { hono } from "../../lib/hono/hono";
import { getPrismaClient } from "../../lib/prisma/client/prismaClient";

export default hono.get("", async (c) => {
  const code = c.req.query("code");
  if (!code) {
    return c.json({ error: "code is required" }, 400);
  }

  const { APP_URL, FREEE_API_CLIENT_ID, FREEE_API_CLIENT_SECRET } =
    envWithType(c);

  const prisma = getPrismaClient(c);

  const result = await getAccessToken({
    code: code,
    grantType: "authorization_code",
    clientId: FREEE_API_CLIENT_ID,
    clientSecret: FREEE_API_CLIENT_SECRET,
    redirectUri: `${APP_URL}/api/auth/callback`,
  });

  await prisma.company.upsert({
    where: {
      companyId: result.company_id,
    },
    update: {
      refreshToken: result.refresh_token,
      name: String(result.company_id),
    },
    create: {
      companyId: result.company_id,
      refreshToken: result.refresh_token,
      name: String(result.company_id),
    },
  });

  return c.json(result);
});
