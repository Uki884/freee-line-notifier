import { Hono } from "hono";

export const showRoute = new Hono().get("", (c) =>
  c.json({ result: `get ${c.req.param("id")}` }),
);
