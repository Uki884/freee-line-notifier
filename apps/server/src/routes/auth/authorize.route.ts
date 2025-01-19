import * as crypto from "node:crypto";
import { Hono } from "hono";

export default new Hono().get("/authorize", (c) => {
  const state = crypto.randomBytes(32).toString("hex");
  const callbackURL = `${process.env.APP_URL}/callback/freee`;
  return c.redirect(
    `${process.env.FREEE_PUBLIC_API_URL}/public_api/authorize?response_type=code&client_id=${process.env.FREEE_API_CLIENT_ID}&redirect_uri=${callbackURL}&state=${state}&prompt=select_company`,
  );
});
