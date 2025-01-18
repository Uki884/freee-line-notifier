import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const newRoute = new Hono().post(
  "",
  zValidator(
    "json",
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  ),
  (c) => {
    const { title, body } = c.req.valid("json");

    return c.json({
      result: "success",
    });
  },
);
