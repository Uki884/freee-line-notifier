const BASE_URL = "https://api.line.me/";
export class LineApi {
  private accessToken: string;

  constructor(readonly payload: { accessToken: string }) {
    this.accessToken = payload.accessToken;
  }

  async getProfile() {
    type Response = {
      userId: string;
      displayName: string;
      statusMessage: string;
      pictureUrl: string;
    };

    const isValid = await this.verifyAccessToken();

    if (!isValid) {
      throw new Error('invalid accessToken')
    }

    const response = await fetch(`${BASE_URL}/v2/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    return (await response.json()) as Response;
  }

  async verifyAccessToken() {
    const params = new URLSearchParams({
      access_token: this.accessToken,
    });

    const response = await fetch(`${BASE_URL}/oauth2/v2.1/verify?${params.toString()}`, {
      method: "GET",
    });

    if (response.status !== 200) {
      return false;
    }

    return true;
  }
}
