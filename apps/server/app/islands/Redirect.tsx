import { liff } from "@line/liff";
import { useEffect } from "hono/jsx";
import { useLiff } from "./hooks/useLiff";

type Props = {
  redirectUrl: string;
  liffId: string;
};

export const Redirect = ({ redirectUrl, liffId }: Props) => {
  // const { liff } = useLiff({ liffId });

  useEffect(() => {
    liff
      .init({
        liffId,
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        liff.openWindow({
          url: redirectUrl,
          external: false,
        });
      });
  }, [liff, redirectUrl]);

  return (
    <div>
      <p>リダイレクトします</p>
      <p>{redirectUrl}</p>
    </div>
  );
};
