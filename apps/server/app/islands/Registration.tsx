import { hc } from "hono/client";
import { useEffect, useState } from "hono/jsx";
import type { AppType } from "../routes/api";
import { useLiff } from "./hooks/useLiff";

type Props = {
  liffId: string;
  freeeCode: string;
};

export const Registration = ({ liffId, freeeCode }: Props) => {
  const { liff } = useLiff({ liffId });
  const [accessToken, setAccessToken] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const client = hc<AppType>("/api");

  useEffect(() => {
    const func = async () => {
      const accessToken = liff?.getAccessToken();
      setAccessToken(accessToken);

      if (!accessToken || !freeeCode) {
        return;
      }

      console.log("accessToken", accessToken, await liff?.getProfile());

      const result = await client.registration.$post({
        form: {
          freeeCode: freeeCode,
          lineAccessToken: accessToken || "",
        },
      });

      const json = await result.json();

      setResult(json);
    };

    func();
  }, [liff]);

  return <div>test</div>;
};
