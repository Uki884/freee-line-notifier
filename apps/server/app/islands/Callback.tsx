import { hc } from "hono/client";
import { useEffect, useState } from "hono/jsx";
import type { AppType } from "../routes/api";
import { useLiff } from "./hooks/useLiff";

type Props = {
  liffId: string;
  freeeCode: string;
};

export const Callback = ({ liffId, freeeCode }: Props) => {
  const { liff } = useLiff({ liffId });
  const [accessToken, setAccessToken] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const client = hc<AppType>("/api");

  useEffect(() => {
    const func = async () => {
      const accessToken = liff?.getAccessToken();
      setAccessToken(accessToken);
      console.log("accessToken", accessToken);

      if (!accessToken) {
        return;
      }

      const result = await client.registration.$post({
        form: {
          freeeCode: freeeCode,
          lineAccessToken: accessToken,
        },
      });
      const json = await result.json();
      setResult(json);
    };

    func();
  }, [liff]);

  return (
    <div>
      <h1>登録完了</h1>
      <p>アクセストークン: {accessToken}</p>
      <p>freeeコード: {freeeCode}</p>
      <p>結果: {JSON.stringify(result)}</p>
    </div>
  );
};
