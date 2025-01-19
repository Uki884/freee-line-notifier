"use server";

import { tokenModule } from "../lib/tokenModule";

export const setAccessTokenAction = async ({
  access_token,
  refresh_token,
  expires_in,
}: { access_token: string; refresh_token: string; expires_in: number }) => {
  await tokenModule.setAccessToken({ access_token, refresh_token, expires_in });
};
