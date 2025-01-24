import { hc } from "hono/client";
import { useEffect, useState } from "hono/jsx";
import type { AppType } from "../routes/api";
import { useLiff } from "./hooks/useLiff";

type Props = {
  liffId: string;
  itemId: string | undefined;
  companyId: string | undefined;
};

export const TransactionEdit = ({ liffId, itemId, companyId }: Props) => {
  const { liff } = useLiff({ liffId });
  const client = hc<AppType>("/api");
  const [result, setResult] = useState({});

  useEffect(() => {
    if (!itemId || !companyId) return;
    const accessToken = liff?.getAccessToken();

    if (!accessToken) return;

    client.transaction[":id"]
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
        },
      )
      .then(async (res) => {
        const { result } = await res.json();
        setResult(result);
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
      {JSON.stringify(result)}
    </div>
  );
};
