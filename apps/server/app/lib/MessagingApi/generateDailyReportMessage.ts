import type { FlexBubble, FlexComponent } from "@line/bot-sdk";
import type { GenerateDailyReportType } from "../../functions/dailyReportModule";
import { formatJST } from "../date-fns";

export const generateDailyReportMessage = ({
  txns,
  deals,
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
        {
          type: "text" as const,
          text: `領収書が添付されていない取引(${deals.length}件)`,
          margin: "sm",
          decoration: "underline" as const,
          weight: "bold",
        },
        {
          type: "box",
          layout: "vertical",
          contents: getDealsText(deals),
        },
      ],
    },
  } satisfies FlexBubble;
};

const getDealsText = (deals: GenerateDailyReportType["deals"]) => {
  const getDealText = (deal: GenerateDailyReportType["deals"][number]) =>
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
              text: formatJST(deal.date),
              gravity: "center",
              size: "lg",
            },
            {
              type: "text",
              text: `ID:${String(deal.id)}`,
              gravity: "center",
              size: "md",
            },
          ],
          margin: "sm",
        },
        {
          type: "text",
          text: `勘定科目: ${deal.accountItemNames.join(", ")}`,
          gravity: "center",
          size: "md",
        },
        {
          type: "button",
          action: {
            type: "uri",
            label: "確認",
            uri: deal.url,
          },
          height: "sm",
          style: "link",
        },
        {
          type: "separator",
        },
      ],
    }) satisfies FlexComponent;

  return deals.map(getDealText);
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
