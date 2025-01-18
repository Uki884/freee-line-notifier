import { apiClient } from "@/src/shared/lib/apiClient";
import { COOKIE_NAMES } from "@app/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  console.log("code", code);

  if (!code) {
    return redirect("/404");
  }

  const { access_token, refresh_token, expires_in } = await apiClient.api.freee.accessToken.$post({
    form: {
      code: code,
    },
  }).then(async (res) => await res.json());

  console.log("accessToken", access_token);

  const cookieStore = await cookies();

  // MEMO: 1年間有効
  const ttl = 60 * 60 * 24 * 365;

  cookieStore.set(COOKIE_NAMES.FREEE_ACCESS_TOKEN, access_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: expires_in,
  });

  cookieStore.set(COOKIE_NAMES.FREEE_REFRESH_TOKEN, refresh_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: ttl,
  });

  redirect("/");
}
