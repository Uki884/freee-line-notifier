import {
  Button,
  Loader,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { InferResponseType } from "hono/client";
import { useEffect, useState } from "react";
import { useLiff } from "./hooks/useLiff";
import { apiClient } from "./lib/apiClient";
import { createHonoComponent } from "./lib/createHonoComponent";

type Props = {
  liffId: string;
  itemId: string | undefined;
  companyId: string | undefined;
};

type ResponseType = InferResponseType<
  (typeof apiClient.transaction)[":id"]["$get"],
  200
>;

export const TransactionEdit = createHonoComponent(
  ({ liffId, itemId, companyId }: Props) => {
    const { liff } = useLiff({ liffId });
    const [isLoading, setIsLoading] = useState(true);

    const [transactionItem, setTransactionItem] =
      useState<ResponseType["result"]>();

    const form = useForm({
      initialValues: {
        issueDate: "",
        amount: 0,
        description: "",
        status: 1,
      },
    });

    useEffect(() => {
      if (!itemId || !companyId) return;

      const accessToken = liff?.getAccessToken();

      if (!accessToken) return;

      apiClient.transaction[":id"]
        .$get(
          {
            query: {
              companyId,
            },
            param: {
              id: itemId,
            },
          },
          {
            headers: {
              Authorization: accessToken,
            },
          },
        )
        .then(async (res) => {
          if (res.status === 200) {
            const { result } = await res.json();
            setTransactionItem(result);
            // フォームの初期値を設定
            form.setValues({
              issueDate: result.date || "",
              amount: Number(result.amount) || 0,
              description: result.description,
              status: result.status || 1,
            });
            setIsLoading(false);
          }
        });
    }, [itemId, companyId, liff, form.setValues]);

    const handleSubmit = form.onSubmit((values) => {
      console.log(values);
      // TODO: APIを呼び出して更新処理を実装
    });

    if (isLoading) {
      return (
        <Paper p="md" shadow="xs">
          <Loader />
        </Paper>
      );
    }

    return (
      <Paper p="md" shadow="xs">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="取引日"
              readOnly
              type="date"
              {...form.getInputProps("issueDate")}
            />
            <NumberInput
              readOnly
              label="金額"
              prefix="¥"
              placeholder="金額を入力"
              thousandsGroupStyle="thousand"
              {...form.getInputProps("amount")}
              allowNegative={false}
              allowDecimal={false}
              thousandSeparator=","
            />
            <Select
              label="勘定科目"
              data={["React", "Angular", "Vue", "Svelte"]}
              {...form.getInputProps("status")}
            />
            <Textarea
              label="備考"
              placeholder="備考を入力"
              {...form.getInputProps("description")}
              value={form.getValues().description}
            />
            <Select
              label="タグ"
              data={["React", "Angular", "Vue", "Svelte"]}
              {...form.getInputProps("status")}
            />
            <Button type="submit">保存</Button>
          </Stack>
        </form>
      </Paper>
    );
  },
);
