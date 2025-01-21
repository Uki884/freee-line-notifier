import { createRoute } from "honox/factory";
import { Callback } from "../../../islands/Callback";

export default createRoute(async (c) => {
  const code = c.req.query("code");
  const { LINE_LIFF_ID, APP_URL } = c.env;

  if (!code) {
    return c.json({ error: "code is required" }, 400);
  }

  return c.render(
    <Callback liffId={LINE_LIFF_ID} freeeCode={code} APP_URL={APP_URL} />
  );
});
