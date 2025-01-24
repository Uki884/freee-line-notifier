import { useLiff } from "./hooks/useLiff";

type Props = {
  liffId: string;
  itemId: string | undefined;
};

export const TransactionEdit = ({ liffId, itemId }: Props) => {
  const { liff } = useLiff({ liffId });

  return (
    <div>
      ID:
      {itemId}
      ログイン: {JSON.stringify(liff?.isLoggedIn())}
      クライアント: {JSON.stringify(liff?.isInClient())}
    </div>
  );
};
