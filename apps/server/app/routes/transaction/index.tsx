import { MantineProvider } from "@mantine/core";
import { createRoute } from "honox/factory";
import { TransactionEdit } from "../../islands/TransactionEdit";
import { theme } from "../../lib/mantine/theme";

export default createRoute(async (c) => {
  const { LINE_LIFF_FRONT_ID } = c.env;
  const itemId = c.req.query("itemId");
  const companyId = c.req.query("companyId");

  return c.render(
    <MantineProvider theme={theme}>
      <TransactionEdit
        liffId={LINE_LIFF_FRONT_ID}
        itemId={itemId}
        companyId={companyId}
      />
    </MantineProvider>,
    { title: "hoge" }
  );
});
