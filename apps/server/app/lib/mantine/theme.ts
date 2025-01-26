import { Textarea, createTheme } from "@mantine/core";

export const theme = createTheme({
  components: {
    Textarea: Textarea.extend({
      defaultProps: {
        minRows: 5,
        maxRows: 20,
        autosize: true,
      },
    }),
  },
});
