import { extendTheme } from "@chakra-ui/react";

export const customTheme = extendTheme({
  colors: {
    pri: {
      100: "#18181b",
      200: "#202023",
      300: "#28282b",
      400: "#303033",
    },
    sec: {
      100: "#fafafa",
      200: "#d4d4d8",
    },
  },
  components: {
    Heading: {
      baseStyle: {
        color: "sec.100",
      },
    },
    Text: {
      baseStyle: {
        color: "sec.200",
      },
    },
  },
});
