import { COOKIE_NAMES } from '@app/constants';
import { Hono } from "hono";
import { getCookie } from 'hono/cookie';
import { getCompanies } from '../../../lib/externalApi/freee/company/getCompanies';
// import { refreshAccessToken } from "../../../lib/externalApi/freee/refreshAccessToken";

export default new Hono().get("", async (c)=> {
  const accessToken = getCookie(c, COOKIE_NAMES.FREEE_ACCESS_TOKEN);
  const refreshToken = getCookie(c, COOKIE_NAMES.FREEE_REFRESH_TOKEN);

  if (!accessToken) {
    // リダイレクト
    return c.json({
      result: "error",
    }, 401);
  }

  // リフレッシュトークンを用いて更新

  // const result = await refreshAccessToken({ refreshToken });

  // console.log('result', result);

  const { companies } = await getCompanies({ accessToken });

  return c.json({
    result: {
      companies,
    },
  });
})
