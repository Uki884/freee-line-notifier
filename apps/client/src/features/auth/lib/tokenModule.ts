import { cookies } from "next/headers";
import { apiClientWithoutToken } from "../../../shared/lib/apiClient";
import { COOKIE_NAMES } from "@/src/shared/constants/COOKIE_NAMES";

const getAccessToken = async () => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

  if (!accessToken) {
    return undefined;
  }

  const isExpired = await isAccessTokenExpired();

  if (isExpired) {
    return await refreshAccessToken({ refreshToken });
  }

  return accessToken;
};

const refreshAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string | undefined;
}) => {
  if (!refreshToken) {
    return undefined;
  }

  const response = await apiClientWithoutToken.api.auth.refreshToken.$post({
    form: {
      refreshToken,
    },
  });

  if (!response.ok) {
    return undefined;
  }

  const { access_token, expires_in, refresh_token } = await response.json();

  // FIXME: server actionかroute handlerでしかcookieのセットができないのでmiddlewareで行う
  // await setAccessTokenAction({
  //   access_token,
  //   refresh_token,
  //   expires_in,
  // });

  return access_token;
};

const isAccessTokenExpired = async () => {
  const cookieStore = await cookies();

  const issuedAt = Number(
    cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN_ISSUED_AT)?.value,
  );
  const expiresIn = Number(
    cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN_EXPIRES_IN)?.value,
  );

  if (!issuedAt || !expiresIn) {
    // 必要なデータが揃っていない場合は期限切れとみなす
    return true;
  }

  const now = Math.floor(Date.now() / 1000); // 現在時刻（秒単位）
  const expirationTime = issuedAt + expiresIn; // 発行時刻 + 有効期間

  return now >= expirationTime; // 現在時刻が有効期限を超えているかを判定
};

const setAccessToken = async ({
  access_token,
  refresh_token,
  expires_in,
}: { access_token: string; refresh_token: string; expires_in: number }) => {
  const cookieStore = await cookies();

  const ttl = 60 * 60 * 24 * 365;
  const issuedAt = Math.floor(Date.now() / 1000); // 現在時刻（秒単位）

  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, access_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: expires_in,
  });

  cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refresh_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: ttl,
  });

  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN_EXPIRES_IN, expires_in.toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: ttl,
  });

  cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN_ISSUED_AT, issuedAt.toString(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: ttl,
  });
};

export const tokenModule = {
  getAccessToken,
  setAccessToken,
};
