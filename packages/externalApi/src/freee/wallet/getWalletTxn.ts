import { type BasePayload, freeeApi } from "../base";

type Payload = {
  id: number;
  companyId: number;
} & BasePayload;

type GetWalletTxnResponse = {
  wallet_txn: {
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
  };
};

export const getWalletTxn = async ({ id, companyId, accessToken }: Payload) => {
  const params = new URLSearchParams({
    company_id: companyId.toString(),
  });

  const { wallet_txn } = await freeeApi
    .private(`wallet_txns/${id}?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(async (res) => (await res.json()) as GetWalletTxnResponse);

  return wallet_txn;
};
