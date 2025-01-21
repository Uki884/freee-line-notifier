import * as line from "@line/bot-sdk";
import type { Env } from "hono";
import { refreshAccessToken } from "../lib/freeeApi/auth/refreshAccessToken";
import { WALLET_TXNS_STATUS, getWallets } from "../lib/freeeApi/wallet/getWallets";
import { getPrisma } from "../lib/prisma/client/prismaClient";

// MEMO: http://localhost:8787/__scheduledにアクセスするとテスト実行される
export default {
  async scheduled(
    controller: ScheduledController,
    env: Env['Bindings'],
    ctx: ExecutionContext,
  ) {
    console.log("cron processed");
    ctx.waitUntil(handleSchedule({ env, ctx }));
  },
};

async function handleSchedule({ env }: { env: Env['Bindings']; ctx: ExecutionContext }) {
const { LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN, DATABASE_URL, FREEE_API_CLIENT_ID, FREEE_API_CLIENT_SECRET } = env;

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
      const accessToken = await refreshAccessToken({
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

      const wallets = await getWallets({
        accessToken: accessToken.access_token,
        companyId: company.companyId,
      });

      const waitingTxns = wallets.wallet_txns.filter(
        (wallet) => wallet.status === WALLET_TXNS_STATUS.WAITING,
      );

      const txns =  waitingTxns.map((txn) => ({
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
  await client.pushMessage({
      to: lineUserId,
      messages: [
        {
          type: "text",
          text: txns.map((txn) => `${txn.date} ${txn.description} ${txn.amount}`).join("\n"),
        },
      ],
    });
  }
};