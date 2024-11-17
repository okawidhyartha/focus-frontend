import { extendTheme } from "@chakra-ui/react";
import "@fontsource/lato";
import { inputTheme } from "./theme/input";

const theme = extendTheme({
  fonts: {
    body: `'Lato', sans-serif`,
  },
  components: { Input: inputTheme },
});

export default theme;
