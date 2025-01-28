import type {
  FlexBubble,
  FlexComponent,
} from "@line/bot-sdk";
import { format } from "date-fns";
import type { GenerateDailyReportType } from "../../services/GenerateDailyReport";
import { formatJST } from "../date-fns";

export const generateDailyReportMessage = (
  payload: GenerateDailyReportType,
) => {
  return generateContents(payload);
};

const SYNC_STATUS_TEXT = {
  success: "成功",
  disabled: "無効",
  syncing: "同期中",
  token_refresh_error: "トークンエラー",
  unsupported: "未サポート",
  other_error: "その他のエラー",
} as const;

export const generateContents = ({
  txns,
  walletables,
}: GenerateDailyReportType) => {
  const txnsCount = txns.length;
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "デイリーレポート",
          weight: "bold",
          size: "xl",
        },
        {
          type: "separator",
          margin: "sm",
        },
        {
          type: "text",
          text: "口座情報",
          margin: "sm",
          decoration: "underline" as const,
          size: "md",
          weight: "bold",
        },
        {
          type: "box",
          layout: "vertical",
          contents: getWalletablesText(walletables),
        },
        {
          type: "text" as const,
          text: `未処理の取引(${txnsCount}件)`,
          margin: "sm",
          decoration: "underline" as const,
          weight: "bold",
        },
        {
          type: "box",
          layout: "vertical",
          contents: getTxnsText(txns),
        },
      ],
    },
  } satisfies FlexBubble;
};

const getWalletablesText = (
  walletables: GenerateDailyReportType["walletables"],
) => {
  const getWalletableText = (
    walletable: GenerateDailyReportType["walletables"][number],
  ) => {
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
                ? formatJST(
                    new Date(walletable.last_synced_at),
                  )
                : "なし",
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
              text: "登録残高",
              size: "sm",
            },
            {
              type: "text",
              align: "center",
              size: "sm",
              text: `¥${walletable.last_balance.toLocaleString()}`,
            },
          ],
          justifyContent: "space-evenly",
        },
        {
          type: "separator",
          margin: "sm",
        } satisfies FlexComponent,
      ],
    } satisfies FlexComponent;
    return result;
  };

  return walletables.map(getWalletableText);
};

const getTxnsText = (txns: GenerateDailyReportType["txns"]) => {
  const getTxnText = (txn: GenerateDailyReportType["txns"][number]) =>
    ({
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: txn.date,
              gravity: "center",
              size: "lg",
            },
            {
              type: "text",
              text: txn.walletableName || "",
              align: "end",
            },
          ],
          margin: "sm",
        },
        {
          type: "text",
          text: txn.description,
          wrap: true,
          size: "sm",
          align: "center",
        },
        {
          type: "button",
          action: {
            type: "uri",
            label: "確認",
            uri: txn.url,
          },
          height: "sm",
          style: "link",
        },
        {
          type: "separator",
        },
      ],
    }) satisfies FlexComponent;

  return txns.map(getTxnText);
};
