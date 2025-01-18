import "server-only";

import { apiClient } from "@/src/shared/lib/apiClient";
import { cache } from "react";

export const getSession = cache(async () => {
  const data = await apiClient.api.auth.authUser.$get();

  if (!data.ok) {
    return null;
  }

  const { result } = await data.json();
  return result;
});
