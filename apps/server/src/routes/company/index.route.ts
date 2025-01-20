import { Hono } from "hono";
import { getCompanies } from "../../lib/externalApi/freee/company/getCompanies";
import { getAccessTokenFromHeader } from "../../lib/hono/getAccessTokenFromHeader";

export default new Hono().get("", async (c) => {
  try {
    const accessToken = getAccessTokenFromHeader(c);

    const { companies } = await getCompanies({ accessToken });
    return c.json({
      result: {
        companies,
      },
    });
  } catch (error) {
    return c.json(
      {
        result: "error",
      },
      401,
    );
  }
});
