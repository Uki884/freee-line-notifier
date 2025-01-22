import {
  WALLET_TXNS_STATUS,
  freeeApi,
} from "@freee-line-notifier/external-api/freee";
import { getPrisma } from "@freee-line-notifier/prisma";
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

  const companyList = await prisma.company.findMany();

  const walletList = await Promise.all(
    companyList.map(async (company) => {
      const refreshToken = company.refreshToken;
      const accessToken = await freeeApi.refreshAccessToken({
        refreshToken,
        clientId: FREEE_API_CLIENT_ID,
        clientSecret: FREEE_API_CLIENT_SECRET,
      });

      await prisma.company.update({
        where: { id: company.id },
        data: {
          refreshToken: accessToken.refresh_token,
        },
      });

      const wallets = await freeeApi.getWallets({
        accessToken: accessToken.access_token,
        companyId: company.companyId,
      });

      const waitingTxns = wallets.wallet_txns.filter(
        (wallet) => wallet.status === WALLET_TXNS_STATUS.WAITING,
      );

      const txns = waitingTxns.map((txn) => ({
        id: txn.id,
        amount: txn.amount,
        description: txn.description,
        date: txn.date,
      }));
      return {
        lineUserId: company.lineUserId,
        txns,
      };
    }),
  );

  for (const { lineUserId, txns } of walletList) {
    const txnsCount = txns.length;

    await client.pushMessage({
      to: lineUserId,
      messages: [
        {
          type: "flex",
          altText: `未処理の取引が${txnsCount}件あります！`,
          contents: {
            type: "bubble",
            body: {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "text",
                  text: `未処理の取引が${txnsCount}件あります！`,
                  weight: "bold",
                  size: "md",
                  align: "center",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      text: "\t「取引を確認」を押して詳細をご確認ください",
                      weight: "regular",
                      size: "xxs",
                      align: "start",
                      margin: "8px",
                    },
                  ],
                },
              ],
            },
            footer: {
              type: "box",
              layout: "vertical",
              spacing: "sm",
              contents: [
                {
                  type: "button",
                  style: "link",
                  height: "sm",
                  action: {
                    type: "message",
                    label: "取引を確認",
                    text: "未処理の取引情報",
                  },
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [],
                  margin: "sm",
                },
              ],
              flex: 0,
            },
          },
        },
      ],
    });
  }
}
