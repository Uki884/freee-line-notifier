import { LineApi } from "@freee-line-notifier/external-api/line";
import type { Env } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const lineAuthMiddleware = createMiddleware<{
  Bindings: Env["Bindings"];
  Variables: Env["Variables"];
}>(async (c, next) => {
  const authorization = c.req.header("Authorization");
  if (!authorization) {
    throw new HTTPException(401, { message: "invalid authorization header" });
  }

  const lineApi = new LineApi({ accessToken: authorization });

  const isValid = await lineApi.verifyAccessToken();

  if (!isValid) {
    throw new HTTPException(401, { message: "invalid accessToken" });
  }
  c.set("accessToken", authorization);

  await next();
});
