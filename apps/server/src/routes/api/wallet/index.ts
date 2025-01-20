import { Hono } from "hono";

import txnsWaiting from "./txnsWaiting.route";

export default new Hono().route("/waiting", txnsWaiting);
