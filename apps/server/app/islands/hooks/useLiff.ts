import { useEffect, useState } from "react";

import type { Liff } from "@line/liff";

export const useLiff = ({ liffId }: { liffId: string }) => {
  const [liffError, setLiffError] = useState<string | null>(null);
  const [liffClient, setLiffClient] = useState<Liff | null>(null);

  useEffect(() => {
    import("@line/liff").then(({ liff }) => {
      liff.init(
        {
          liffId,
          withLoginOnExternalBrowser: true,
        },
        () => {
          setLiffClient(liff);
        },
      );
    });
  }, [liffId]);

  return {
    liff: liffClient,
    liffError,
  };
};
