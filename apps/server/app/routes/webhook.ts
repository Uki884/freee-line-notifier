import * as line from "@line/bot-sdk";
import { createRoute } from "honox/factory";

export const POST = createRoute(async (c) => {
  const { CALLBACK_URL, LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN } =
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

        if (message === "ログイン") {
          await client.replyMessage({
            replyToken: event.replyToken,
            messages: [
              {
                type: "template",
                altText: "Account Link",
                template: {
                  type: "buttons",
                  text: "連携開始を押してfreeeと連携してください",
                  actions: [
                    {
                      type: "uri",
                      label: "連携開始",
                      uri: CALLBACK_URL,
                    },
                  ],
                },
              },
            ],
          });
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

