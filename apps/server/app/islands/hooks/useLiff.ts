import { useEffect, useState } from "hono/jsx";

import type { Liff } from "@line/liff";

export const useLiff = ({ liffId }: { liffId: string }) => {
  const [liffClient, setLiffClient] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    console.log("LIFF init start...");

    import("@line/liff").then(({ liff }) => {
      console.log("LIFF init...");
      liff.init({
        liffId,
        withLoginOnExternalBrowser: true
      });
      setLiffClient(liff);
    });
    }, []);

  return {
    liff: liffClient,
    liffError,
  };
};
