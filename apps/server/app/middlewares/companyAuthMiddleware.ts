import type { Env } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const companyAuthMiddleware = createMiddleware<{
  Bindings: Env["Bindings"];
  Variables: Env["Variables"];
}>(async (c, next) => {
  const companyId = c.req.query("companyId");

  if (!companyId) {
    throw new HTTPException(400, {
      message: "クエリパラメータに事業所IDがありません",
    });
  }

  const currentUser = c.get("currentUser");

  const result = currentUser.companies
    .map((company) => company.companyId)
    .includes(Number(companyId));

  if (!result) {
    throw new HTTPException(400, {
      message: "事業所がユーザーに紐づいていません",
    });
  }

  await next();
});
