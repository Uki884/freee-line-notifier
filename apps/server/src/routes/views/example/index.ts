import { Hono } from "hono";

import IndexView from "./index.view";

export default new Hono().route("/", IndexView);

