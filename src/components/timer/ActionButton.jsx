import { Button } from "@chakra-ui/react";
import { useVibe } from "../../hooks/useVibe";

// eslint-disable-next-line react/prop-types
export default function ActionButton({ children, ...props }) {
  const { color } = useVibe();

  return (
    <Button
      textTransform="uppercase"
      fontSize="36px"
      height="59px"
      px="36px"
      borderRadius="full"
      color={color}
      {...props}
    >
      {children}
    </Button>
  );
}
