import { COOKIE_NAMES } from '@app/constants';
import { Hono } from "hono";
import { getCookie } from 'hono/cookie';
// import { refreshAccessToken } from "../../../lib/externalApi/freee/refreshAccessToken";

export default new Hono().get("", async (c)=> {
  const accessToken = getCookie(c, COOKIE_NAMES.FREEE_ACCESS_TOKEN);
  const refreshToken = getCookie(c, COOKIE_NAMES.FREEE_REFRESH_TOKEN);

  if (!refreshToken) {
    // リダイレクト
    return c.json({
      result: "error",
    });
  }

  // リフレッシュトークンを用いて更新

  // const result = await refreshAccessToken({ refreshToken });

  // console.log('result', result);

  const result = await fetch(`${process.env.FREEE_API_URL}/api/1/companies`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  })
  .then(async (res) => await res.json())

  return c.json({
    companyList: result.companies,
  });
})
