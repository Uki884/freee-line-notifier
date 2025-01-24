import { freeeApi } from "@freee-line-notifier/external-api/freee";
import { createRoute } from "honox/factory";
import { TransactionEdit } from "../../islands/TransactionEdit";

export default createRoute(async (c) => {
  const { LINE_LIFF_FRONT_ID } = c.env;
  const itemId = c.req.query("itemId");
  const companyId = c.req.query("companyId");

  return c.render(
    <TransactionEdit
      liffId={LINE_LIFF_FRONT_ID}
      itemId={itemId}
      companyId={companyId}
    />,
  );
});
