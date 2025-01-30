import {
  FreeePrivateApi,
  FreeePublicApi,
} from "@freee-line-notifier/external-api/freee";
import type { getPrisma } from "@freee-line-notifier/prisma";
import type { FlexBubble } from "@line/bot-sdk";
import { generateFailedWalletsMessage } from "../lib/MessagingApi/generateFailedWalletsMessage";

export class NotifySyncFailedWallets {
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
    const company = await this.payload.prisma.company.findFirstOrThrow({
      where: {
        userId,
        status: "active",
      },
      include: {
        user: true,
      },
    });

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

    const filteredWalletables = walletables.filter(
      (walletable) =>
        walletable.sync_status === "other_error" ||
        walletable.sync_status === "token_refresh_error",
    );

    return filteredWalletables;
  }

  static generateLineMessage(result: NotifySyncFailedWalletsType) {
    const count = result.length;

    return {
      type: "flex" as const,
      altText: `同期エラー通知(${count}件)`,
      contents: {
        type: "bubble",
        body: {
          type: "box" as const,
          layout: "vertical" as const,
          contents: [
            {
              type: "text" as const,
              text: `同期エラー通知(${count}件)`,
              weight: "bold" as const,
              size: "lg" as const,
            },
            {
              type: "separator" as const,
              margin: "sm" as const,
            },
            {
              type: "text" as const,
              text: "口座情報",
              margin: "sm" as const,
              decoration: "underline" as const,
              weight: "bold" as const,
            },
            {
              type: "box",
              layout: "vertical",
              contents: generateFailedWalletsMessage(result),
            },
          ],
        },
      } satisfies FlexBubble,
    };
  }
}

export type NotifySyncFailedWalletsType = Awaited<
  ReturnType<NotifySyncFailedWallets["execute"]>
>;
