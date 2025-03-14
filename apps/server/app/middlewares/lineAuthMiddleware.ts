import { LineApi } from "@freee-line-notifier/external-api/line";
import { HTTPException } from "hono/http-exception";
import { createMiddlewareWithEnv } from "../lib/hono/createMiddlewareWithEnv";

export const lineAuthMiddleware = createMiddlewareWithEnv(async (c, next) => {
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
