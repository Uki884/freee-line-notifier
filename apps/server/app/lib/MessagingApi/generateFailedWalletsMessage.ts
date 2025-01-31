import type { FlexComponent } from "@line/bot-sdk";
import type { GetSyncFailedWalletsType } from "../../functions/walletModule";
import { formatJST } from "../date-fns";

const SYNC_STATUS_TEXT = {
  success: "成功",
  disabled: "無効",
  syncing: "同期中",
  token_refresh_error: "トークンエラー",
  unsupported: "未サポート",
  other_error: "その他のエラー",
} as const;

export const generateFailedWalletsMessage = (
  walletables: GetSyncFailedWalletsType,
) => {
  const getWalletableText = (walletable: GetSyncFailedWalletsType[number]) => {
    const result = {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: walletable.name,
          size: "lg",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "同期ステータス",
              size: "sm",
            },
            {
              type: "text",
              text: SYNC_STATUS_TEXT[walletable.sync_status],
              color: "#fa5252",
              align: "center",
              size: "sm",
            },
          ],
          justifyContent: "space-evenly",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "最終同期日時",
              size: "sm",
            },
            {
              type: "text",
              text: walletable.last_synced_at
                ? formatJST(new Date(walletable.last_synced_at))
                : "なし",
              align: "center",
              size: "sm",
            },
          ],
          justifyContent: "space-evenly",
        },
      ],
    } satisfies FlexComponent;
    return result;
  };

  return walletables.map(getWalletableText);
};
