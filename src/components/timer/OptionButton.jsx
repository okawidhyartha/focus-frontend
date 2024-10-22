import { Button } from "@chakra-ui/react";

// eslint-disable-next-line react/prop-types
export default function OptionButton({ children, active, ...props }) {
  return (
    <Button
      width="145px"
      variant={active ? "solid" : "ghost"}
      fontWeight="bold"
      fontSize="20px"
      color="white"
      background={active ? "rgba(0,0,0,0.2)" : "transparent"}
      _hover={{ background: "rgba(0,0,0,0.2)" }}
      {...props}
    >
      {children}
    </Button>
  );
}
