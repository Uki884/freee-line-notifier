import { getPrisma } from "@freee-line-notifier/prisma";
import {
  GetPendingTransactions,
  generateTxnsMessage,
} from "@freee-line-notifier/server";
import * as line from "@line/bot-sdk";
import type { Env } from "hono";

// MEMO: http://localhost:8787/__scheduledにアクセスするとテスト実行される
export default {
  async scheduled(
    controller: ScheduledController,
    env: Env["Bindings"],
    ctx: ExecutionContext,
  ) {
    switch (controller.cron) {
      // 毎朝10時に実行される(UTC+9)
      case "0 1 * * *":
        ctx.waitUntil(handleSchedule({ env, ctx }));
        break;
      default:
        ctx.waitUntil(handleSchedule({ env, ctx }));
        break;
    }
  },
};

async function handleSchedule({
  env,
}: { env: Env["Bindings"]; ctx: ExecutionContext }) {
  const {
    LINE_CHANNEL_SECRET,
    LINE_CHANNEL_ACCESS_TOKEN,
    DATABASE_URL,
    FREEE_API_CLIENT_ID,
    FREEE_API_CLIENT_SECRET,
  } = env;

  const config: line.ClientConfig = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  };

  const client = new line.messagingApi.MessagingApiClient(config);

  line.middleware({ channelSecret: LINE_CHANNEL_SECRET });
  const prisma = getPrisma(DATABASE_URL);

  const getPendingTransactions = new GetPendingTransactions({
    prisma,
    FREEE_API_CLIENT_ID,
    FREEE_API_CLIENT_SECRET,
  });

  const userList = await prisma.user.findMany();

  const walletList = await Promise.all(
    userList.map(async (user) => {
      return await getPendingTransactions.execute({
        userId: user.id,
      });
    }),
  );

  const map = walletList.map(async (wallet) => {
    return await Promise.all(
      wallet.map(async (txn) => {
        const txnsCount = txn.txns.length;
        await client.pushMessage({
          to: txn.lineUserId,
          messages: [
            {
              type: "flex",
              altText: `未処理の取引が${txnsCount}件あります！`,
              contents: generateTxnsMessage({
                txns: txn.txns,
              }),
            },
          ],
        });
      }),
    );
  });

  await Promise.all(map);
}
