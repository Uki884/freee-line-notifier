import { freeeApi } from "../base";

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
  company_id: number;
};

type Payload = {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
};

export const refreshAccessToken = async ({
  refreshToken,
  clientId,
  clientSecret,
}: Payload) => {
  const result = await freeeApi
    .public("/token", {
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
    })
    .then(async (res) => await res.json());

  return result as AccessTokenResponse;
};
