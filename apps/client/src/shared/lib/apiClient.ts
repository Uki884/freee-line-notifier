import { hc } from "@app/server";
import type { apiRoutes } from "@app/server/types";
import { tokenModule } from "../../features/auth/lib/tokenModule";

export const hcWithType = (...args: Parameters<typeof hc>) =>
  hc<typeof apiRoutes>(...args);

export const apiClient = hcWithType(
  process.env.HOST || "http://localhost:3000/",
  {
    async fetch(input, requestInit, Env, executionCtx) {
      const accessToken = await tokenModule.getAccessToken();

      return fetch(input, {
        ...requestInit,
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      });
    },
  },
);

export const apiClientWithoutToken = hcWithType(
  process.env.HOST || "http://localhost:3000/",
);

