import type { Context } from "hono";
import { env } from "hono/adapter";
import type { Bindings } from "./types";

export const envWithType = (c: Context) => {
  return env<Bindings>(c);
};
