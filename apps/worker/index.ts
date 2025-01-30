import { getPrisma } from "@freee-line-notifier/prisma";
import {
  GenerateDailyReport,
} from "@freee-line-notifier/server";
import * as line from "@line/bot-sdk";
import type { Env } from "hono";

const SCHEDULE_TYPE = {
  DAILY_REPORT: "DAILY_REPORT",
  WALLETS_REPORT: "WALLETS_REPORT",
} as const;

type ScheduleType = typeof SCHEDULE_TYPE[keyof typeof SCHEDULE_TYPE];

type ScheduleHandler = {
  client: line.messagingApi.MessagingApiClient;
  env: Env["Bindings"];
  scheduleCtx: ExecutionContext;
};

// MEMO: http://localhost:8787/__scheduledにアクセスするとテスト実行される
export default {
  async scheduled(
    controller: ScheduledController,
    env: Env["Bindings"],
    ctx: ExecutionContext,
  ) {
    switch (controller.cron) {
      // 毎朝10時に実行される(UTC+9)
      case "0 0 * * *":
        ctx.waitUntil(handleSchedule({ env, ctx, type: SCHEDULE_TYPE.DAILY_REPORT }));
        break;
    }
  },
};

async function handleSchedule({
  env,
  type,
  ctx,
}: { env: Env["Bindings"]; ctx: ExecutionContext, type: ScheduleType }) {
  const { LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN, DATABASE_URL } = env;

  const config: line.ClientConfig = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  };

  const client = new line.messagingApi.MessagingApiClient(config);

  line.middleware({ channelSecret: LINE_CHANNEL_SECRET });

  switch (type) {
    case SCHEDULE_TYPE.DAILY_REPORT:
      await dailyReportHandler({ client, env, scheduleCtx: ctx });
      break;
  }
}

const dailyReportHandler = async ({
  client,
  env,
}: ScheduleHandler) => {
  const { DATABASE_URL } = env;

  const prisma = getPrisma(DATABASE_URL);
    const generateDailyReport = new GenerateDailyReport({
    prisma,
    clientId: env.FREEE_API_CLIENT_ID,
    clientSecret: env.FREEE_API_CLIENT_SECRET,
  });

  const userList = await prisma.user.findMany();

  await Promise.all(
    userList.map(async (user) => {
      const result = await generateDailyReport.execute({
        userId: user.id,
      });

      await client.pushMessage({
        to: result.lineUserId,
        messages: [
          GenerateDailyReport.generateLineMessage(result),
        ],
      });
    }),
  );
}
