export const getAccessToken = async ({ code }: { code: string }) => {
  const result = await fetch(`${process.env.FREEE_PUBLIC_API_URL}/public_api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.FREEE_API_CLIENT_ID || '',
      client_secret: process.env.FREEE_API_CLIENT_SECRET || '',
      code: code,
      redirect_uri: `${process.env.APP_URL}/callback/freee`,
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