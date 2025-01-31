import {
  FreeePrivateApi,
  WALLET_TXNS_STATUS,
} from "@freee-line-notifier/external-api/freee";
import { getPrisma } from "@freee-line-notifier/prisma";
import type { Env } from "hono";
import { generateDailyReportMessage } from "../lib/MessagingApi/generateDailyReportMessage";
import { formatJST } from "../lib/date-fns";
import { refreshAccessToken } from "./refreshAccessToken";

const RECEIPT_REQUIRED_ITEMS = [
  {
    name: "通信費",
    id: 626477503,
  },
  {
    name: "交際費",
    id: 626477505,
  },
  {
    name: "消耗品費",
    id: 626477509,
  },
  {
    name: "事務用品費",
    id: 626477509,
  },
  {
    name: "会議費",
    id: 626477529,
  },
  {
    name: "新聞図書費",
    id: 626477530,
  },
  {
    name: "雑費",
    id: 626477534,
  },
  {
    name: "工具器具備品",
    id: 626477442,
  },
  {
    name: "ソフトウェア",
    id: 626477543,
  },
  {
    name: "旅費交通費",
    id: 626477502,
  },
  {
    name: "租税公課",
    id: 626477498,
  },
];

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

  const [walletables, walletTxnList, deals] = await Promise.all([
    await privateApi.getWalletables({
      companyId: company.companyId,
    }),
    await privateApi.getWalletTxnList({
      companyId: company.companyId,
    }),
    await privateApi.getDeals({
      companyId: company.companyId,
    }),
  ]);

  const tagDeals = deals
    .filter((deal) => {
      const isRequiredReceipt = deal.details.some((detail) => {
        return RECEIPT_REQUIRED_ITEMS.some(
          (item) => item.id === detail.account_item_id,
        );
      });
      const noReceipt = deal.receipts.length === 0;
      return isRequiredReceipt && noReceipt;
    }
  )
    .map((deal) => ({
      id: deal.id,
      date: deal.issue_date,
      url: `https://secure.freee.co.jp/reports/journals?deal_id=${deal.id}&openExternalBrowser=1`,
      amount: deal.amount,
      accountItemNames: deal.details
        .map(
          (detail) =>
            RECEIPT_REQUIRED_ITEMS.find(
              (item) => item.id === detail.account_item_id,
            )?.name,
        )
        .filter((name) => name !== undefined),
    }));

  const waitingTxns = walletTxnList
    .filter((wallet) => wallet.status === WALLET_TXNS_STATUS.WAITING)
    .map((txn) => ({
      id: txn.id,
      url: `https://secure.freee.co.jp/wallet_txns/stream/${txn.id}?openExternalBrowser=1`,
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
