import { createRoute } from "honox/factory";
import { TransactionEdit } from "../../islands/TransactionEdit";

export default createRoute(async (c) => {
  const { LINE_LIFF_FRONT_ID } = c.env;
  const itemId = c.req.query("itemId");
  const companyId = c.req.query("companyId");

  console.log("itemId", itemId, companyId);

  return c.render(
    <TransactionEdit
      liffId={LINE_LIFF_FRONT_ID}
      itemId={itemId}
      companyId={companyId}
    />,
  );
});
