import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const xl = defineStyle({
  fontSize: "lg",
  px: "4",
  h: "12",
});

const transparent = definePartsStyle({
  field: {
    backgroundColor: "transparent",
    h: "50px",
    fontSize: "lg",
    p: 0,
    // border: "1px solid",
    // borderColor: "gray.200",
    // background: "gray.50",
    // borderRadius: "full",

    // // Let's also provide dark mode alternatives
    // _dark: {
    //   borderColor: "gray.600",
    //   background: "gray.800",
    // },
  },
});

const sizes = {
  xl: definePartsStyle({ field: xl, addon: xl }),
};

export const inputTheme = defineMultiStyleConfig({
  sizes,
  variants: { transparent },
});
