// 明細のステータス（消込待ち: 1, 消込済み: 2, 無視: 3, 消込中: 4, 対象外: 6）
export const WALLET_TXNS_STATUS = {
  WAITING: 1,
  SETTLED: 2,
  IGNORED: 3,
  SETTING: 4,
  EXCLUDED: 6,
} as const;
