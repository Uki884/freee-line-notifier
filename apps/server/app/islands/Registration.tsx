import { hc } from "hono/client";
import { useEffect } from "hono/jsx";
import type { AppType } from "../routes/api";
import { useLiff } from "./hooks/useLiff";

type Props = {
  liffId: string;
  freeeCode: string;
};

export const Registration = ({ liffId, freeeCode }: Props) => {
  const { liff } = useLiff({ liffId });
  const client = hc<AppType>("/api");

  useEffect(() => {
    const func = async () => {
      const accessToken = liff?.getAccessToken();

      if (!accessToken || !freeeCode) {
        return;
      }

      await client.registration.$post({
        form: {
          freeeCode: freeeCode,
          lineAccessToken: accessToken || "",
        },
      });

      await liff?.sendMessages([
        {
          type: "text",
          text: "freee会計と連携が完了しました",
        },
      ]);
    };

    func();
  }, [liff]);

  return (
    <div>
      <p>freee会計と連携が完了しました</p>
    </div>
  );
};
