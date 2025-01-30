import {
  FreeePrivateApi,
  FreeePublicApi,
  WALLET_TXNS_STATUS,
} from "@freee-line-notifier/external-api/freee";
import type { getPrisma } from "@freee-line-notifier/prisma";
import { generateDailyReportMessage } from "../lib/MessagingApi/generateDailyReportMessage";
import { formatJST } from "../lib/date-fns";

export class GenerateDailyReport {
  constructor(
    private readonly payload: {
      prisma: ReturnType<typeof getPrisma>;
      clientId: string;
      clientSecret: string;
    },
  ) {}

  async execute({
    userId,
  }: {
    userId: string;
  }) {
    const user = await this.payload.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      include: {
        activeCompany: true,
      },
    });

    const company = user.activeCompany;

    const publicApi = new FreeePublicApi({
      clientId: this.payload.clientId,
      clientSecret: this.payload.clientSecret,
    });

    const accessToken = await publicApi.refreshAccessToken({
      refreshToken: company.refreshToken,
    });

    const privateApi = new FreeePrivateApi({
      accessToken: accessToken.access_token,
    });

    await this.payload.prisma.company.update({
      where: { id: company.id },
      data: {
        refreshToken: accessToken.refresh_token,
      },
    });

    const walletables = await privateApi.getWalletables({
      companyId: company.companyId,
    });

    const allWalletTxns = await privateApi.getWalletTxnList({
      companyId: company.companyId,
    });

    const waitingTxns = allWalletTxns.filter(
      (wallet) => wallet.status === WALLET_TXNS_STATUS.WAITING,
    );

    const txns = waitingTxns.map((txn) => ({
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
      txns,
    };
  }

  static generateLineMessage(result: GenerateDailyReportType) {
    const today = formatJST(new Date(), "yyyy/MM/dd");

    return {
      type: "flex" as const,
      altText: `デイリーレポート(${today})`,
      contents: generateDailyReportMessage(result),
    };
  }
}

export type GenerateDailyReportType = Awaited<
  ReturnType<GenerateDailyReport["execute"]>
>;
