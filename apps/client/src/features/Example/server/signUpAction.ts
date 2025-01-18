"use server";

import { apiClient } from "@/src/shared/lib/apiClient";

type Props = {
  name: string;
  email: string;
  password: string;
};

export const signUpAction = async ({ name, email, password }: Props) => {
  const result = await apiClient.api.auth.signUp.$post({
    json: { name, email, password },
  });
  return result;
};
