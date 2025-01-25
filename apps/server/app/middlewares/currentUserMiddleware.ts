import { LineApi } from "@freee-line-notifier/external-api/line";
import { getPrisma } from "@freee-line-notifier/prisma";
import type { Env } from "hono";
import { createMiddleware } from "hono/factory";

export const currentUserMiddleware = createMiddleware<{
  Bindings: Env["Bindings"];
  Variables: Env["Variables"];
}>(async (c, next) => {
  const { DATABASE_URL } = c.env;
  const accessToken = c.get("accessToken");
  const prisma = getPrisma(DATABASE_URL);

  const lineApi = new LineApi({ accessToken });

  const { userId: lineUserId } = await lineApi.getProfile();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      lineUserId,
    },
    include: {
      companies: {
        select: {
          id: true,
          companyId: true,
          refreshToken: true,
        },
      },
    },
  });

  c.set("currentUser", user);

  await next();
});
