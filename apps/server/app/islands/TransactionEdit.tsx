import type { InferResponseType } from "hono/client";
import { useEffect, useState } from "hono/jsx";
import { useLiff } from "./hooks/useLiff";
import { apiClient } from "./lib/apiClient";

type Props = {
  liffId: string;
  itemId: string | undefined;
  companyId: string | undefined;
};

type ResponseType = InferResponseType<
  (typeof apiClient.transaction)[":id"]["$get"],
  200
>;

export const TransactionEdit = ({ liffId, itemId, companyId }: Props) => {
  const { liff } = useLiff({ liffId });

  const [transactionItem, setTransactionItem] =
    useState<ResponseType["result"]>();

  useEffect(() => {
    if (!itemId || !companyId) return;

    const accessToken = liff?.getAccessToken();

    if (!accessToken) return;

    apiClient.transaction[":id"]
      .$get(
        {
          query: {
            companyId,
          },
          param: {
            id: itemId,
          },
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
      .then(async (res) => {
        if (res.status === 200) {
          const { result } = await res.json();
          setTransactionItem(result);
        }
      });
  }, [liff]);

  return (
    <div>
      ID:
      {itemId}
      CompanyId: {companyId}
      ログイン: {JSON.stringify(liff?.isLoggedIn())}
      クライアント: {JSON.stringify(liff?.isInClient())}
      アクセストークン: {JSON.stringify(liff?.getAccessToken())}
      結果:
      {JSON.stringify(transactionItem)}
    </div>
  );
};
