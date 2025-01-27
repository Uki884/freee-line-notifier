import { getPrisma } from "@freee-line-notifier/prisma";
import * as line from "@line/bot-sdk";
import { format } from "date-fns";
import type { Env } from "hono";
import { generateDailyReportMessage } from "../server/app/lib/MessagingApi/generateDailyReportMessage";
import { GenerateDailyReport } from "../server/app/services/GenerateDailyReport";

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
  const { LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN, DATABASE_URL } = env;

  const config: line.ClientConfig = {
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  };

  const client = new line.messagingApi.MessagingApiClient(config);

  line.middleware({ channelSecret: LINE_CHANNEL_SECRET });
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
      const today = format(new Date(), "yyyy/MM/dd");

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
    }),
  );
}
