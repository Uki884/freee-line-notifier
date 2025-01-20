import * as crypto from "node:crypto";
import { envWithType } from "../../lib/hono/env";
import { hono } from "../../lib/hono/hono";

export default hono.get("", (c) => {
  const state = crypto.randomBytes(32).toString("hex");
  const { APP_URL, FREEE_API_CLIENT_ID, FREEE_PUBLIC_API_URL } = envWithType(c);
  const callbackURL = `${APP_URL}/api/auth/callback`;

  return c.redirect(
    `${FREEE_PUBLIC_API_URL}/public_api/authorize?response_type=code&client_id=${FREEE_API_CLIENT_ID}&redirect_uri=${callbackURL}&state=${state}&prompt=select_company`,
  );
});
