import type { Context } from "hono";

export const getAccessTokenFromHeader = (c: Context) => {
  const authorization = c.req.header("Authorization");
  const accessToken = authorization?.split(" ")[1];
  console.log("accessToken", accessToken);

  if (!accessToken) {
    throw new Error("Access token is not found");
  }

  return accessToken;
};
