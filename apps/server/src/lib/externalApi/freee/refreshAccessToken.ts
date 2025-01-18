export const refreshAccessToken = async ({ refreshToken }: { refreshToken: string }) => {
  const result = await fetch(`${process.env.FREEE_PUBLIC_API_URL}/public_api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.FREEE_API_CLIENT_ID || '',
      client_secret: process.env.FREEE_API_CLIENT_SECRET || '',
      refresh_token: refreshToken,
    }),
  })
  .then(async (res) => await res.json())

  return result as AccessTokenResponse;
}

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
  company_id: number;
}