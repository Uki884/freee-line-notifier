import * as crypto from "node:crypto";
import * as line from '@line/bot-sdk';
import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

const app = createApp()

app.get('/', (c) => {
  return c.json({ message: 'Hello World' })
})

app.post('/webhook', async (c) => {
  const { CALLBACK_URL, FREEE_API_CLIENT_ID, FREEE_PUBLIC_API_URL, LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN } =
  c.env;

  const config: line.ClientConfig = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  };
  const client = new line.messagingApi.MessagingApiClient(config);

  line.middleware({ channelSecret: LINE_CHANNEL_SECRET });

  const events: line.WebhookEvent[] = await c.req.json().then((data) => data.events);
  const state = crypto.randomBytes(32).toString("hex");

  const redirectUrl = `${FREEE_PUBLIC_API_URL}/public_api/authorize?response_type=code&client_id=${FREEE_API_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&state=${state}&prompt=select_company`;

  await Promise.all(
    events.map(async (event: line.WebhookEvent) => {
      try {
        await textEventHandler(client, event, redirectUrl);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('err', err);
        }
        return c.json({ message: 'error' })
      }
    }),
  );

  return c.json({ message: 'success' })
});

const textEventHandler = async (client: line.messagingApi.MessagingApiClient, event: line.WebhookEvent, redirectUrl: string) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const message = event.message.text;

  if (message === 'ログイン') {
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: redirectUrl }],
    });
  }
};

showRoutes(app)

export default app;
