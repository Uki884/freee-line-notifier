import type { FlexBubble, FlexComponent } from "@line/bot-sdk";
import type { GenerateDailyReportType } from "../../services/GenerateDailyReport";

export const generateDailyReportMessage = ({
  txns,
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
