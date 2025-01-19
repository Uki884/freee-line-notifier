import { tokenModule } from "@/src/features/auth/lib/tokenModule";
import { apiClient } from "@/src/shared/lib/apiClient";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return redirect("/404");
  }

  // アクセストークン取得
  const response = await apiClient.api.auth.accessToken.$post({
    form: { code },
  });

  if (!response.ok) {
    console.error("Failed to fetch access token:", response.statusText);
    return redirect("/404");
  }

  const { access_token, refresh_token, expires_in, company_id } =
    await response.json();

  // ログインするたびに会社を更新する
  const companyResponse = await apiClient.api.companies.save.$put({
    form: {
      companyId: company_id,
      refreshToken: refresh_token,
    },
  });

  if (!companyResponse.ok) {
    console.error("Failed to update company info:", companyResponse.statusText);
    return redirect("/404");
  }

  await tokenModule.setAccessToken({
    access_token,
    refresh_token,
    expires_in,
  });

  redirect("/");
}

