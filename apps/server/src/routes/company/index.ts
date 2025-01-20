import { Hono } from "hono";

import indexRoute from "./index.route";
import saveRoute from "./save.route";

export default new Hono().route("/", indexRoute).route("/save", saveRoute);
