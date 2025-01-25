import type { Env } from "hono";
import { createMiddleware } from "hono/factory";

export const createMiddlewareWithEnv = createMiddleware<{
  Bindings: Env["Bindings"];
  Variables: Env["Variables"];
}>;
