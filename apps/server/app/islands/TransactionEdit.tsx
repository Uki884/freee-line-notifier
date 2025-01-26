import {
  Button,
  MantineProvider,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { InferResponseType } from "hono/client";
import { useEffect, useState } from "hono/jsx";
import { useLiff } from "./hooks/useLiff";
import { apiClient } from "./lib/apiClient";

type Props = {
  liffId: string;
  itemId: string | undefined;
  companyId: string | undefined;
};

type ResponseType = InferResponseType<
  (typeof apiClient.transaction)[":id"]["$get"],
  200
>;

export const TransactionEdit = ({ liffId, itemId, companyId }: Props) => {
  const { liff } = useLiff({ liffId });

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
        }
      )
      .then(async (res) => {
        if (res.status === 200) {
          const { result } = await res.json();
          setTransactionItem(result);
          // フォームの初期値を設定
          form.setValues({
            issueDate: result.date || "",
            amount: result.amount || 0,
            description: "",
            status: result.status || 1,
          });
        }
      });
  }, [itemId, companyId, liff, form.setValues]);

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
    // TODO: APIを呼び出して更新処理を実装
  });

  return (
    <MantineProvider>
      <Paper p="md" shadow="xs">
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="取引日"
              type="date"
              {...form.getInputProps("issueDate")}
            />
            <TextInput
              label="取引先"
              placeholder="取引先名を入力"
              {...form.getInputProps("partnerName")}
            />
            <NumberInput
              label="金額"
              placeholder="金額を入力"
              {...form.getInputProps("amount")}
            />
            <Textarea
              label="備考"
              placeholder="備考を入力"
              {...form.getInputProps("description")}
            />
            <Select
              label="ステータス"
              data={["React", "Angular", "Vue", "Svelte"]}
              {...form.getInputProps("status")}
            />
            <Button type="submit">保存</Button>
          </Stack>
        </form>
      </Paper>
    </MantineProvider>
  );
};
