import { getPrisma } from "@freee-line-notifier/prisma";
import {
  GenerateDailyReport,
  NotifySyncFailedWallets,
} from "@freee-line-notifier/server";
import * as line from "@line/bot-sdk";
import type { Env } from "hono";

const SCHEDULE_TYPE = {
  DAILY_REPORT: "DAILY_REPORT",
  SYNC_FAILED_WALLETS: "SYNC_FAILED_WALLETS",
} as const;

type ScheduleType = (typeof SCHEDULE_TYPE)[keyof typeof SCHEDULE_TYPE];

// MEMO: http://localhost:8787/__scheduled?cron=30+23+*+*+*にアクセスするとテスト実行される
export default {
  async scheduled(
    controller: ScheduledController,
    env: Env["Bindings"],
    ctx: ExecutionContext,
  ) {
    switch (controller.cron) {
      // 毎朝10時に実行される(UTC+9)
      case "0 0 * * *":
        ctx.waitUntil(
          handleSchedule({ env, type: SCHEDULE_TYPE.DAILY_REPORT }),
        );
      break;
      //　毎朝8時半に実行される(UTC+9)
      case "30 23 * * *":
        ctx.waitUntil(
          handleSchedule({ env, type: SCHEDULE_TYPE.SYNC_FAILED_WALLETS }),
        );
        break;
    }
  },
};

async function handleSchedule({
  env,
  type,
}: { env: Env["Bindings"]; type: ScheduleType }) {
  const { LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN, DATABASE_URL } = env;

  const config: line.ClientConfig = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  };

  const client = new line.messagingApi.MessagingApiClient(config);

  line.middleware({ channelSecret: LINE_CHANNEL_SECRET });

  const prisma = getPrisma(DATABASE_URL);
  const userList = await prisma.user.findMany();

  switch (type) {
    case SCHEDULE_TYPE.DAILY_REPORT:
      {
        const generateDailyReport = new GenerateDailyReport({
          prisma,
          clientId: env.FREEE_API_CLIENT_ID,
          clientSecret: env.FREEE_API_CLIENT_SECRET,
        });

        await Promise.all(
          userList.map(async (user) => {
            const result = await generateDailyReport.execute({
              userId: user.id,
            });
            console.log("SCHEDULE_TYPE.DAILY_REPORT result", result);

            await client.pushMessage({
              to: user.lineUserId,
              messages: [GenerateDailyReport.generateLineMessage(result)],
            });
          }),
        );
      }
      break;
    case SCHEDULE_TYPE.SYNC_FAILED_WALLETS:
      {
        const notify = new NotifySyncFailedWallets({
          prisma,
          clientId: env.FREEE_API_CLIENT_ID,
          clientSecret: env.FREEE_API_CLIENT_SECRET,
        });

        await Promise.all(
          userList.map(async (user) => {
            const result = await notify.execute({
              userId: user.id,
            });
            console.log("SCHEDULE_TYPE.SYNC_FAILED_WALLETS result", result);
            // MEMO: 失敗してる口座がない場合は実行しない
            if (result.length === 0) {
              return;
            }

            await client.pushMessage({
              to: user.lineUserId,
              messages: [NotifySyncFailedWallets.generateLineMessage(result)],
            });
          }),
        );
      }
      break;
  }
}
