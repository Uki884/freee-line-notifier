import { type BasePayload, freeeApi } from "../base";

type Payload = {
  companyId: number;
} & BasePayload;

type GetWalletsResponse = {
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

// 明細のステータス（消込待ち: 1, 消込済み: 2, 無視: 3, 消込中: 4, 対象外: 6）
export const WALLET_TXNS_STATUS = {
  WAITING: 1,
  SETTLED: 2,
  IGNORED: 3,
  SETTING: 4,
  EXCLUDED: 6,
} as const;

export const getWallets = async ({ companyId, accessToken }: Payload) => {
  const PER_PAGE = 100;
  let allWalletTxns: GetWalletsResponse["wallet_txns"] = [];
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
      .then(async (res) => (await res.json()) as GetWalletsResponse);

    if (!result.wallet_txns?.length) {
      break;
    }

    allWalletTxns = [...allWalletTxns, ...result.wallet_txns];
    offset += PER_PAGE;
  }

  return { wallet_txns: allWalletTxns } as GetWalletsResponse;
};
