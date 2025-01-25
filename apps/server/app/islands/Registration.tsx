import { useEffect } from "hono/jsx";
import { useLiff } from "./hooks/useLiff";
import { apiClient } from "./lib/apiClient";

type Props = {
  liffId: string;
  freeeCode: string;
};

export const Registration = ({ liffId, freeeCode }: Props) => {
  const { liff } = useLiff({ liffId });

  useEffect(() => {
    const func = async () => {
      const accessToken = liff?.getAccessToken();

      if (!accessToken || !freeeCode) {
        return;
      }

      await apiClient.registration.$post(
        {
          form: {
            code: freeeCode,
          },
        },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

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
