import {
  FreeePrivateApi,
  WALLET_TXNS_STATUS,
} from "@freee-line-notifier/external-api/freee";
import { getPrisma } from "@freee-line-notifier/prisma";
import type { Env } from "hono";
import { generateDailyReportMessage } from "../lib/MessagingApi/generateDailyReportMessage";
import { formatJST } from "../lib/date-fns";
import { refreshAccessToken } from "./refreshAccessToken";

const generateDailyReport = async ({
  env,
  lineUserId,
}: { env: Env["Bindings"]; lineUserId: string }) => {
  const { DATABASE_URL } = env;
  const prisma = getPrisma(DATABASE_URL);
  const user = await prisma.user.findFirstOrThrow({
    where: {
      lineUserId,
    },
    include: {
      activeCompany: true,
    },
  });
  const company = user.activeCompany;

  const result = await refreshAccessToken({
    env,
    refreshToken: company.refreshToken,
  });

  const privateApi = new FreeePrivateApi({
    accessToken: result.accessToken,
  });

  const { tags } = await privateApi.getTags({
    companyId: company.companyId,
  });

  // TODO:DBから値を取ってくる
  const targetTags = tags.filter((tag) => ["要対応"].includes(tag.name));

  const walletables = await privateApi.getWalletables({
    companyId: company.companyId,
  });

  const allWalletTxns = await privateApi.getWalletTxnList({
    companyId: company.companyId,
  });

  const deals = await privateApi.getDeals({
    companyId: company.companyId,
  });

  const tagDeals = deals.filter((deal) =>
    deal.details.some((detail) => {
      return detail.tag_ids.some((tagId) =>
        targetTags.map((tag) => tag.id).includes(tagId),
      );
    }),
  );

  const waitingTxns = allWalletTxns
    .filter((wallet) => wallet.status === WALLET_TXNS_STATUS.WAITING)
    .map((txn) => ({
      id: txn.id,
      url: `https://secure.freee.co.jp/wallet_txns/stream/${txn.id}`,
      amount: txn.amount,
      description: txn.description,
      walletableName: walletables.find(
        (wallet) => wallet.id === txn.walletable_id,
      )?.name,
      date: txn.date,
    }));

  return {
    companyId: company.companyId,
    txns: waitingTxns,
    deals: tagDeals,
    targetTags,
  };
};

const generateLineMessage = (result: GenerateDailyReportType) => {
  const today = formatJST(new Date(), "yyyy/MM/dd");

  return {
    type: "flex" as const,
    altText: `デイリーレポート(${today})`,
    contents: generateDailyReportMessage(result),
  };
};

export const dailyReportModule = {
  generate: generateDailyReport,
  message: generateLineMessage,
};

export type GenerateDailyReportType = Awaited<
  ReturnType<typeof generateDailyReport>
>;
