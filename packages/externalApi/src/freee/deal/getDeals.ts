import { type BasePayload, freeeApi } from "../base";

type Payload = {
  companyId: number;
} & BasePayload;

export const getDeals = async ({ companyId, accessToken }: Payload) => {
  const params = new URLSearchParams({
    company_id: companyId.toString(),
    status: "settled",
  });

  const result = await freeeApi
    .private(`deals?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async (res) => await res.json());

  return result as GetDealsResponse;
};

type GetDealsResponse = {
  deals: {
    id: number;
    company_id: number;
    issue_date: string;
    due_date: string;
    amount: number;
    due_amount: number;
    type: string;
    partner_id: number;
    partner_code: string;
    ref_number: string;
    status: string;
    deal_origin_name: string;
  }[];
  meta: {
    total_count: number;
  };
};
