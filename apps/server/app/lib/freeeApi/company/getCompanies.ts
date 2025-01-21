import { freeeApi } from "../base";

type GetCompaniesResponse = {
  companies: {
    id: number;
    name: string | null;
    name_kana: string | null;
    display_name: string;
    company_number: string;
    role: string;
  }[];
};

type Payload = {
  accessToken: string;
};

export const getCompanies = async ({ accessToken }: Payload) => {
  const response = await freeeApi.private("companies", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return (await response.json()) as GetCompaniesResponse;
};
