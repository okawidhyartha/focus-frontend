import { Button } from "@chakra-ui/react";
import { useTimer } from "../../hooks/useTimer";
import { useSettings } from "../../hooks/useSettings";
import { motion } from "motion/react";

// eslint-disable-next-line react/prop-types
export default function ActionButton({ children, ...props }) {
  const { playing, selectedOption } = useTimer();
  const { color, focusBackground, focusBackgroundPreview } = useSettings();

  return (
    <Button
      as={motion.button}
      whileHover={{ scale: 1.05 }}
      textTransform="uppercase"
      fontSize={{ base: "20px", md: "36px" }}
      height={{ base: "40px", md: "59px" }}
      px={{ base: "20px", md: "36px" }}
      borderRadius="full"
      color={
        (playing && focusBackground && selectedOption === "focusTime") ||
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
