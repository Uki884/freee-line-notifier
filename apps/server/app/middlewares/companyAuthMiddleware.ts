import { HTTPException } from "hono/http-exception";
import { createMiddlewareWithEnv } from "../lib/hono/createMiddlewareWithEnv";

export const companyAuthMiddleware = createMiddlewareWithEnv(
  async (c, next) => {
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
  },
);
