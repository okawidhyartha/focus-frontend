import { Button } from "@chakra-ui/react";
import { useTimer } from "../../hooks/useTimer";

// eslint-disable-next-line react/prop-types
export default function ActionButton({ children, ...props }) {
  const { color, focusBackground, focusBackgroundPreview, playing, selectedOption } =
    useTimer();

  return (
    <Button
      textTransform="uppercase"
      fontSize="36px"
      height="59px"
      px="36px"
      borderRadius="full"
      color={
        (playing && focusBackground && selectedOption === "focus-time") ||
        focusBackgroundPreview
          ? "black"
          : color
      }
      transition="color 1s"
      {...props}
    >
      {children}
    </Button>
  );
}
