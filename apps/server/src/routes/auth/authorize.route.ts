import * as crypto from "node:crypto";
import { hono } from "../../lib/hono/hono";
import { env } from "hono/adapter";
import { Bindings } from "../../lib/hono/types";

export default hono.get("/authorize", (c) => {
  const state = crypto.randomBytes(32).toString("hex");
  const { APP_URL, FREEE_API_CLIENT_ID, FREEE_PUBLIC_API_URL } = env<Bindings>(c);

  console.log("APP_URL", APP_URL, "FREEE_API_CLIENT_ID", FREEE_API_CLIENT_ID, "FREEE_PUBLIC_API_URL", FREEE_PUBLIC_API_URL);
  const callbackURL = `${APP_URL}/callback/freee`;

  return c.redirect(
    `${FREEE_PUBLIC_API_URL}/public_api/authorize?response_type=code&client_id=${FREEE_API_CLIENT_ID}&redirect_uri=${callbackURL}&state=${state}&prompt=select_company`,
  );
});
