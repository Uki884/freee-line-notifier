import { getPrisma } from "@freee-line-notifier/prisma";
import { Prisma } from "@freee-line-notifier/prisma/output/edge";
import * as line from "@line/bot-sdk";
import type { Context, Env } from "hono";
import { createRoute } from "honox/factory";
import { generateDailyReportMessage } from "../lib/MessagingApi/generateDailyReportMessage";
import { formatJST } from "../lib/date-fns";
import { GenerateDailyReport } from "../services/GenerateDailyReport";

type LineClientParams = {
  accessToken: string;
  secret: string;
};

const initializeLineClient = ({ accessToken, secret }: LineClientParams) => {
  const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: accessToken,
  });
  line.middleware({ channelSecret: secret });
  return client;
};

type BaseContext = {
  client: line.messagingApi.MessagingApiClient;
  prisma: ReturnType<typeof getPrisma>;
  context: Context;
  env: Env["Bindings"];
};

const user = Prisma.validator<Prisma.UserDefaultArgs>()({});

type User = Prisma.UserGetPayload<typeof user>;

type MessageHandlerContext = BaseContext & {
  event: line.MessageEvent;
  user: User | null;
};

const handleAccountSettings = async ({
  client,
  event,
  user,
  env,
}: MessageHandlerContext) => {
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
            user
              ? {
                  type: "message",
                  label: "アカウント連携解除",
                  text: "アカウント連携解除",
                }
              : {
                  type: "uri",
                  label: "アカウント連携開始",
                  uri: env.LINE_LIFF_AUTH_URL,
                },
          ],
        },
      },
    ],
  });
};

const handleMenu = async ({
  client,
  event,
  user,
  env,
}: MessageHandlerContext) => {
  if (!user) {
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [notLinkedMessage(env.LINE_LIFF_AUTH_URL)],
    });
    return;
  }

  await client.replyMessage({
    replyToken: event.replyToken,
    messages: [
      {
        type: "template",
        altText: "メニュー",
        template: {
          type: "buttons",
          text: "メニュー",
          actions: [
            {
              type: "message",
              label: "デイリーレポート取得",
              text: "デイリーレポート",
            },
          ],
        },
      },
    ],
  });
};

const handleDailyReport = async ({
  client,
  user,
  prisma,
  env,
}: MessageHandlerContext) => {
  const generateDailyReport = new GenerateDailyReport({
    prisma,
    clientId: env.FREEE_API_CLIENT_ID,
    clientSecret: env.FREEE_API_CLIENT_SECRET,
  });

  if (!user) {
    return;
  }

  const result = await generateDailyReport.execute({
    userId: user.id,
  });
  const today = formatJST(new Date());

  await client.pushMessage({
    to: result.lineUserId,
    messages: [
      {
        type: "flex",
        altText: `デイリーレポート(${today})`,
        contents: generateDailyReportMessage(result),
      },
    ],
  });
};

const handleUnlinkAccount = async ({
  client,
  event,
  user,
  env,
  prisma,
}: MessageHandlerContext) => {
  if (!user) {
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [notLinkedMessage(env.LINE_LIFF_AUTH_URL)],
    });
    return;
  }

  await prisma.user.delete({
    where: {
      lineUserId: user.lineUserId,
    },
  });

  await client.replyMessage({
    replyToken: event.replyToken,
    messages: [{ type: "text", text: "アカウント連携を解除しました" }],
  });
};

const handleMessageEvent = async ({
  event,
  client,
  prisma,
  env,
  context,
}: BaseContext & { event: line.WebhookEvent }) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return;
  }

  const message = event.message.text;
  const userId = event.source.userId;
  const user = await prisma.user.findUnique({
    where: {
      lineUserId: userId,
    },
  });

  const messageContext: MessageHandlerContext = {
    client,
    event,
    user,
    prisma,
    env,
    context,
  };

  switch (message) {
    case "アカウント設定":
      await handleAccountSettings(messageContext);
      break;
    case "メニュー":
      await handleMenu(messageContext);
      break;
    case "デイリーレポート":
      await handleDailyReport(messageContext);
      break;
    case "アカウント連携解除":
      await handleUnlinkAccount(messageContext);
      break;
  }
};

export const POST = createRoute(async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const client = initializeLineClient({
    accessToken: c.env.LINE_CHANNEL_ACCESS_TOKEN,
    secret: c.env.LINE_CHANNEL_SECRET,
  });

  const events: line.WebhookEvent[] = await c.req
    .json()
    .then((data) => data.events);

  const signature = c.req.header("x-line-signature");
  const body = await c.req.text();

  if (!signature || !line.validateSignature(body, c.env.LINE_CHANNEL_SECRET, signature)) {
    throw new line.SignatureValidationFailed("signature validation failed", {
      signature,
    });
  }

  await Promise.all(
    events.map(async (event) => {
      try {
        c.executionCtx.waitUntil(
          handleMessageEvent({
            event,
            client,
            prisma,
            env: c.env,
            context: c,
          }),
        );
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
