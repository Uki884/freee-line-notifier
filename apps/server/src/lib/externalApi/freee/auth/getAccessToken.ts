import { publicApi } from "../base";

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: string;
  company_id: number;
};

type Payload = {
  grantType: "authorization_code" | "refresh_token";
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUri: string;
};

export const getAccessToken = async ({ code, grantType, clientId, clientSecret, redirectUri }: Payload) => {
  const result = await publicApi("/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: grantType,
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
    }),
  }).then(async (res) => await res.json());

  return result as AccessTokenResponse;
};
