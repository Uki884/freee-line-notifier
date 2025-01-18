import { Hono } from "hono";

export const authUserRoute = new Hono().get("", async (c) => {
  const authUser = c.get("authUser");

  if (!authUser) {
    return c.json(
      {
        result: "Unauthorized",
      },
      401,
    );
  }

  return c.json(
    {
      result: authUser.session,
    },
    200,
  );
});
