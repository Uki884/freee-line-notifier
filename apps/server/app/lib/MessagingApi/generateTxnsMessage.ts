import type { FlexBubble } from "@line/bot-sdk";

type Payload = {
  id: number;
  amount: number;
  description: string;
  date: string;
}[];

export const generateTxnsMessage = ({
  txns,
  liffUrl,
}: {
  txns: Payload;
  liffUrl: string;
}) => {
  const txnsCount = txns.length;
  const message = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "未処理の取引",
              weight: "bold",
              size: "xl",
              flex: 0,
            },
            {
              type: "text",
              text: `${txnsCount}件`,
              size: "lg",
              color: "#666666",
              align: "end",
              flex: 1,
            },
          ],
          margin: "md",
        },
        {
          type: "separator",
          margin: "xxl",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "xxl",
          spacing: "sm",
          contents: txns.map((txn) => ({
            type: "box",
            layout: "vertical",
            margin: "xxl" as const,
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: txn.date,
                    size: "lg",
                    color: "#555555",
                    flex: 1,
                    gravity: "center",
                    align: "start",
                  },
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "編集",
                      uri: `${liffUrl}?txnId=${txn.id}`,
                    },
                    height: "sm",
                    style: "primary",
                    gravity: "center",
                    scaling: false,
                    adjustMode: "shrink-to-fit",
                    color: "#4C88BF",
                  },
                ],
              },
              {
                type: "text",
                text: txn.description,
                size: "md",
                wrap: true,
                margin: "sm",
              },
              {
                type: "text",
                text: `¥${txn.amount.toLocaleString()}`,
                size: "lg",
                weight: "bold",
                align: "end",
              },
              {
                type: "separator",
                margin: "md",
              },
            ],
          })),
        },
      ],
    },
    styles: {
      footer: {
        separator: true,
      },
    },
  } satisfies FlexBubble;

  return message;
};
