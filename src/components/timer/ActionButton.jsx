import { Button } from "@chakra-ui/react";
import { useTimer } from "../../hooks/useTimer";

// eslint-disable-next-line react/prop-types
export default function ActionButton({ children, ...props }) {
  const { color } = useTimer();

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
