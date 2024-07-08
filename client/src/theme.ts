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
    Button: {
      variants: {
        outline: {
          bg: "pri.200",
          borderColor: "sec.100",
          color: "sec.100",
          _hover: {
            bg: "pri.300",
          },
          _active: {
            bg: "pri.300",
          },
        },
        solid: {
          bg: "sec.100",
          color: "pri.100",
          _hover: {
            bg: "sec.200",
          },
        },
        muted: {
          bg: "pri.300",
          color: "sec.100",
          size: "md",
          _hover: {
            bg: "pri.100",
          },
          _active: {
            bg: "pri.100",
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "pri.300",
            borderColor: "pri.100",
            color: "sec.100",
            _placeholder: {
              color: "sec.200",
            },
            _focus: {
              borderColor: "sec.100",
              boxShadow: "0 0 0 1px sec.100",
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "pri.200",
        },
        header: {
          color: "sec.100",
        },
        closeButton: {
          color: "sec.100",
        },
      },
    },
  },
});
