import { freeeApi } from "../base";

type Payload = {
  accessToken: string;
};

export const getCurrentUser = async ({ accessToken }: Payload) => {
  const result = await freeeApi
    .private("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async (res) => await res.json());

  return result as GetCurrentUserResponse;
};

type GetCurrentUserResponse = {
  id: number;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  first_name_kana: string;
  last_name_kana: string;
  companies: {
    id: number;
    display_name: string;
    role: string;
    use_custom_role: boolean;
    advisor_id: number;
  }[];
};
