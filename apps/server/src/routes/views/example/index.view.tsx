import { Hono } from "hono";
import { ExampleView } from "../../../view/features/Example/ExampleView";

export default new Hono().get("/", (c) => {
  return c.html(<ExampleView />);
});
