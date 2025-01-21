import { liff } from "@line/liff";
import { useEffect } from "hono/jsx";

type Props = {
  redirectUrl: string;
  liffId: string;
};

export const Redirect = ({ redirectUrl, liffId }: Props) => {
  useEffect(() => {
    liff
      .init({
        liffId,
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        liff.openWindow({
          url: redirectUrl,
          external: true,
        });
      });
  }, [liff, redirectUrl]);

  return (
    <div>
      <p>freee会計にログインします...</p>
    </div>
  );
};
