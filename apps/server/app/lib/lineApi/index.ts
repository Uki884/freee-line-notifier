import * as line from "@line/bot-sdk";
import type { Context } from "hono";
import { envWithType } from "../hono/env";

const MessagingApiClient = line.messagingApi.MessagingApiClient;

export const getMessagingApiClient = (c: Context) => {
  const { LINE_CHANNEL_ACCESS_TOKEN } = envWithType(c);

  return new MessagingApiClient({
    channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  });
};
