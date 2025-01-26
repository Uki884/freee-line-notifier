import { privateApi, publicApi } from "./base";
import type { GetAccessTokenResponse, GetCompaniesResponse, GetCurrentUserResponse, GetDealsResponse, GetWalletTxnResponse, GetWalletTxtListResponse } from "./types";
export * from "./constants";
export * from "./types";

export class FreeePublicApi {
  async getAccessToken({
    code,
    grantType,
    clientId,
    clientSecret,
    redirectUri,
  }: {
    grantType: "authorization_code" | "refresh_token";
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
  }) {
    const result = await publicApi("/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: grantType,
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    }).then(async (res) => await res.json());
    return result as GetAccessTokenResponse;
  }

  async refreshAccessToken({
    refreshToken,
    clientId,
    clientSecret,
  }: { refreshToken: string; clientId: string; clientSecret: string }) {
    const result = await publicApi("/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
    }).then(async (res) => await res.json());

    return result as GetAccessTokenResponse;
  }
}
export class FreeePrivateApi {
  private accessToken?: string;

  constructor(readonly payload: { accessToken?: string }) {
    this.accessToken = payload.accessToken;
  }

  getWalletTxn = async ({
    id,
    companyId,
  }: {
    id: number;
    companyId: number;
  }) => {
    const params = new URLSearchParams({
      company_id: companyId.toString(),
    });

    const { wallet_txn } = await privateApi(
      `wallet_txns/${id}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    ).then(async (res) => (await res.json()) as GetWalletTxnResponse);

    return wallet_txn;
  };

  getWalletTxnList = async ({ companyId }: { companyId: number }) => {
    const PER_PAGE = 100;
    let allWalletTxns: GetWalletTxtListResponse["wallet_txns"] = [];
    let offset = 0;

    while (true) {
      const params = new URLSearchParams({
        company_id: companyId.toString(),
        limit: PER_PAGE.toString(),
        offset: offset.toString(),
      });

      const result = await privateApi(`wallet_txns?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }).then(async (res) => (await res.json()) as GetWalletTxtListResponse);

      if (!result.wallet_txns?.length) {
        break;
      }

      allWalletTxns = [...allWalletTxns, ...result.wallet_txns];
      offset += PER_PAGE;
    }

    return { wallet_txns: allWalletTxns } as GetWalletTxtListResponse;
  };

  getCurrentUser = async () => {
    const result = await privateApi("/users/me", {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then(async (res) => await res.json());

    return result as GetCurrentUserResponse;
  };

  getDeals = async ({ companyId }: { companyId: number }) => {
    const params = new URLSearchParams({
      company_id: companyId.toString(),
      status: "settled",
    });

    const result = await privateApi(`deals?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).then(async (res) => await res.json());

    return result as GetDealsResponse;
  };

  getCompanies = async () => {
    const response = await privateApi("companies", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return (await response.json()) as GetCompaniesResponse;
  };
}
