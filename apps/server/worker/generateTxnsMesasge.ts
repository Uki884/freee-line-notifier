type Payload = {
    id: number;
    amount: number;
    description: string;
    date: string;
}[]

export const generateTxnsMessage = (payload: Payload) => {
  return {
    type: "bubble" as const,
    body: {
      type: "box" as const,
      layout: "vertical" as const,
      contents: [
        {
          type: "text" as const,
          text: "未承認の取引",
          weight: "bold" as const,
          size: "xl" as const,
          margin: "md" as const
        },
        {
          type: "separator" as const,
          margin: "xxl" as const
        },
        {
          type: "box" as const,
          layout: "vertical" as const,
          margin: "xxl" as const,
          spacing: "sm" as const,
          contents: payload.map((txn) => ({
            type: "box" as const,
            layout: "vertical" as const,
            margin: "xxl" as const,
            contents: [
              {
                type: "text" as const,
                text: txn.date,
                size: "sm" as const,
                color: "#1DB446" as const
              },
              {
                type: "text" as const,
                text: txn.description,
                size: "md" as const,
                wrap: true
              },
              {
                type: "text" as const,
                text: `¥${txn.amount.toLocaleString()}`,
                size: "lg" as const,
                weight: "bold" as const
              },
              {
                type: "separator" as const,
                margin: "md" as const
              }
            ]
          }))
        }
      ]
    },
    styles: {
      footer: {
        separator: true
      }
    }
  };
};
