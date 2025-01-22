import { getPrisma } from "@freee-line-notifier/prisma";
import * as line from "@line/bot-sdk";
import { createRoute } from "honox/factory";
import { generateTxnsMessage } from "../lib/MessagingApi/generateTxnsMessage";
import { GetPendingTransactions } from "../services/getPendingTransactions";

export const POST = createRoute(async (c) => {
  const {
    LIFF_URL,
    LINE_CHANNEL_SECRET,
    LINE_CHANNEL_ACCESS_TOKEN,
    DATABASE_URL,
    FREEE_API_CLIENT_ID,
    FREEE_API_CLIENT_SECRET,
  } = c.env;

  const prisma = getPrisma(DATABASE_URL);

  const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  });

  line.middleware({ channelSecret: LINE_CHANNEL_SECRET });

  const events: line.WebhookEvent[] = await c.req
    .json()
    .then((data) => data.events);

  await Promise.all(
    events.map(async (event: line.WebhookEvent) => {
      try {
        if (event.type !== "message" || event.message.type !== "text") {
          return;
        }

        const message = event.message.text;

        const user = event.source.userId;
        const hasUser = await prisma.company.findUnique({
          where: {
            lineUserId: user,
          },
          select: {
            id: true,
          },
        });

        switch (message) {
          case "アカウント設定": {
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: [
                {
                  type: "template",
                  altText: "Account Link",
                  template: {
                    type: "buttons",
                    text: "設定メニュー",
                    actions: [
                      hasUser
                        ? {
                            type: "message",
                            label: "アカウント連携解除",
                            text: "アカウント連携解除",
                          }
                        : {
                            type: "uri",
                            label: "アカウント連携開始",
                            uri: LIFF_URL,
                          },
                    ],
                  },
                },
              ],
            });
            break;
          }
          case "取引情報": {
            if (!hasUser) {
              await client.replyMessage({
                replyToken: event.replyToken,
                messages: [notLinkedMessage(LIFF_URL)],
              });
              break;
            }
            await client.replyMessage({
              replyToken: event.replyToken,
              messages: [
                {
                  type: "template",
                  altText: "取引情報メニュー",
                  template: {
                    type: "buttons",
                    text: "取引情報メニュー",
                    actions: [
                      {
                        type: "message",
                        label: "未処理の取引情報取得",
                        text: "未処理の取引情報",
                      },
                    ],
                  },
                },
              ],
            });
            break;
          }
          case "未処理の取引情報": {
            const getPendingTransactions = new GetPendingTransactions(
              prisma,
              FREEE_API_CLIENT_ID,
              FREEE_API_CLIENT_SECRET,
            );
            const walletList = await getPendingTransactions.execute();
            for (const { lineUserId, txns } of walletList) {
              await client.pushMessage({
                to: lineUserId,
                messages: [
                  {
                    type: "flex",
                    altText: "未処理の取引の詳細",
                    contents: generateTxnsMessage(txns),
                  },
                ],
              });
            }
            break;
          }
          case "アカウント連携解除": {
            if (!hasUser) {
              await client.replyMessage({
                replyToken: event.replyToken,
                messages: [notLinkedMessage(LIFF_URL)],
              });
              break;
            }
            await prisma.company.delete({
              where: {
                lineUserId: event.source.userId,
              },
            });

            await client.replyMessage({
              replyToken: event.replyToken,
              messages: [
                { type: "text", text: "アカウント連携を解除しました" },
              ],
            });
            break;
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("err", err);
        }
        return c.json({ message: "error" });
      }
    }),
  );

  return c.json({ message: "success" });
});

const notLinkedMessage = (LIFF_URL: string) => {
  return {
    type: "template",
    altText: "アカウント連携されていません",
    template: {
      type: "buttons",
      text: "アカウントが連携されていません。「アカウント連携する」を押して連携してください。",
      actions: [
        {
          type: "uri",
          label: "アカウント連携する",
          uri: LIFF_URL,
        },
      ],
    },
  } satisfies line.TemplateMessage;
};
