import { Hono } from "hono";
import { walletTxnsWaitingUsecase } from "../../usecases/wallet/walletTxnsWaiting.usecase";

export default new Hono().get("", async (c) => {
  const result = await walletTxnsWaitingUsecase(c);
  return c.json(result);
});
