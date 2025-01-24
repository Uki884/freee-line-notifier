import { type BasePayload, freeeApi } from "../base";

type Payload = {
  companyId: number;
} & BasePayload;

type GetWalletTxtListResponse = {
  wallet_txns: {
    id: number;
    status: 1 | 2 | 3 | 4 | 6;
    amount: number;
    balance: number;
    date: string;
    entry_side: "income" | "expense";
    walletable_type: "bank_account" | "credit_card" | "wallet";
    walletable_id: number;
    description: string;
    due_amount: number;
    rule_matched: boolean;
  }[];
};

export const getWalletTxnList = async ({ companyId, accessToken }: Payload) => {
  const PER_PAGE = 100;
  let allWalletTxns: GetWalletTxtListResponse["wallet_txns"] = [];
  let offset = 0;

  while (true) {
    const params = new URLSearchParams({
      company_id: companyId.toString(),
      limit: PER_PAGE.toString(),
      offset: offset.toString(),
    });

    const result = await freeeApi
      .private(`wallet_txns?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(async (res) => (await res.json()) as GetWalletTxtListResponse);

    if (!result.wallet_txns?.length) {
      break;
    }

    allWalletTxns = [...allWalletTxns, ...result.wallet_txns];
    offset += PER_PAGE;
  }

  return { wallet_txns: allWalletTxns } as GetWalletTxtListResponse;
};
