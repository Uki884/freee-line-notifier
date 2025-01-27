import {
  FreeePrivateApi,
  FreeePublicApi,
  WALLET_TXNS_STATUS,
} from "@freee-line-notifier/external-api/freee";
import type { getPrisma } from "@freee-line-notifier/prisma";

export class GetPendingTransactions {
  constructor(
    private readonly payload: {
      prisma: ReturnType<typeof getPrisma>;
      FREEE_API_CLIENT_ID: string;
      FREEE_API_CLIENT_SECRET: string;
    },
  ) {}

  async execute({
    userId,
  }: {
    userId: string;
  }) {
    const user = await this.payload.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        companies: true,
      },
    });

    const walletList = await Promise.all(
      user.companies.map(async (company) => {
        const publicApi = new FreeePublicApi();

        const refreshToken = company.refreshToken;
        const accessToken = await publicApi.refreshAccessToken({
          refreshToken,
          clientId: this.payload.FREEE_API_CLIENT_ID,
          clientSecret: this.payload.FREEE_API_CLIENT_SECRET,
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

        const wallets = await privateApi.getWalletTxnList({
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
          lineUserId: user.lineUserId,
          companyId: company.companyId,
          txns,
        };
      }),
    );

    return walletList;
  }
}
