import * as auth from "./auth";
import { publicApi } from "./base";
import * as company from "./company";
import * as deal from "./deal";
import * as user from "./user";
import * as wallet from "./wallet";

export const freeeApi = {
  ...auth,
  ...company,
  ...deal,
  ...user,
  ...wallet,
};

export * from "./constants";

export class FreeeApi {
  private accessToken: string;

  constructor(readonly payload: { accessToken: string }) {
    this.accessToken = payload.accessToken;
  }

  async getAccessToken({
    code,
    grantType,
    clientId,
    clientSecret,
    redirectUri,
  }: {
    grantType: "authorization_code" | "refresh_token";
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
  }) {
    const result = await publicApi("/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: grantType,
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    }).then(async (res) => await res.json());

    type AccessTokenResponse = {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
      created_at: string;
      company_id: number;
    };
    return result as AccessTokenResponse;
  }

  async refreshAccessToken({
    refreshToken,
    clientId,
    clientSecret,
  }: { refreshToken: string; clientId: string; clientSecret: string }) {
    const result = await publicApi("/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    }).then(async (res) => await res.json());

    type AccessTokenResponse = {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
      created_at: number;
      company_id: number;
    };

    return result as AccessTokenResponse;
  }
}