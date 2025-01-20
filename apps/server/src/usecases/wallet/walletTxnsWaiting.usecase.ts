import type { Context } from "hono";
import { refreshAccessToken } from "../../lib/freeeApi/auth/refreshAccessToken";
import { WALLET_TXNS_STATUS, getWallets } from "../../lib/freeeApi/wallet/getWallets";
import { envWithType } from "../../lib/hono/env";
import { getPrismaClient } from "../../lib/prisma/client/prismaClient";

export const walletTxnsWaitingUsecase = async (c: Context) => {
  const prisma = getPrismaClient(c);
  const { FREEE_API_CLIENT_ID, FREEE_API_CLIENT_SECRET } = envWithType(c);

  const companyList = await prisma.company.findMany();

  const walletList = await Promise.all(companyList.map(async (company) => {
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
      })

      const waitingTxns = wallets.wallet_txns.filter((wallet) => wallet.status === WALLET_TXNS_STATUS.WAITING);

      return waitingTxns.map((txn) => ({
        id: txn.id,
        amount: txn.amount,
        description: txn.description,
        date: txn.date,
      }));
    })
  );

  return walletList;
};


