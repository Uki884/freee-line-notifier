import { type Liff, liff } from "@line/liff";
import { useEffect, useState } from "hono/jsx";

type Props = {
  liffId: string;
};

export const Redirect = ({ liffId }: Props) => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);

  useEffect(() => {
    console.log("init");
    liff
      .init({ liffId })
      .then(() => {
        setLiffObject(liff);
        if (liff.isLoggedIn()) {
          console.log("Logged in");
        }
      })
      .catch((err) => {
        console.error({ err });
      });
  }, []);

  return <div>{JSON.stringify(liffObject?.isInClient())}</div>;
};
