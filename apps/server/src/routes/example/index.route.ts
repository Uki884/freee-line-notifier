import { Hono } from "hono";
import { exampleIndexUsecase } from "../../usecases/example/index.usecase";

export const indexRoute = new Hono().get("", async (c) => {
  const result = await exampleIndexUsecase();
  return c.json({ result: result });
});
