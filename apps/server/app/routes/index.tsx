import crypto from "node:crypto";
import { createRoute } from "honox/factory";
import { Redirect } from "../islands/Redirect";
import { Registration } from "../islands/Registration";

export default createRoute(async (c) => {
  const {
    LINE_LIFF_ID,
    CALLBACK_URL,
    FREEE_PUBLIC_API_URL,
    FREEE_API_CLIENT_ID,
  } = c.env;

  const code = c.req.query("code");

  if (code) {
    return c.render(<Registration freeeCode={code} liffId={LINE_LIFF_ID} />);
  }

  const state = crypto.randomBytes(32).toString("hex");

  const redirectUrl = `${FREEE_PUBLIC_API_URL}/public_api/authorize?response_type=code&client_id=${FREEE_API_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${state}&prompt=select_company`;

  return c.render(<Redirect liffId={LINE_LIFF_ID} redirectUrl={redirectUrl} />);
});
