import { getPrisma } from "@freee-line-notifier/prisma";
import * as line from "@line/bot-sdk";
import { createRoute } from "honox/factory";

export const POST = createRoute(async (c) => {
  const { LIFF_URL, LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN, DATABASE_URL } =
    c.env;

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

        switch (message) {
          case "設定": {
            const prisma = getPrisma(DATABASE_URL);

            const user = event.source.userId;
            const hasUser = await prisma.company.findUnique({
              where: {
                lineUserId: user,
              },
              select: {
                id: true,
              },
            });

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
                    hasUser ? {
                      type: "message",
                      label: "アカウント連携解除",
                      text: "アカウント連携解除",
                    } : {
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
          case "アカウント連携解除": {
            const prisma = getPrisma(DATABASE_URL);

            await prisma.company.delete({
              where: {
                lineUserId: event.source.userId,
              },
            });

            await client.replyMessage({
              replyToken: event.replyToken,
              messages: [{ type: "text", text: "アカウント連携を解除しました" }],
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

