import { Button } from "@chakra-ui/react";

// eslint-disable-next-line react/prop-types
export default function OptionButton({ children, active, ...props }) {
  return (
    <Button
      width={{ base: "80px", sm: "90px", md: "145px" }}
      variant={active ? "solid" : "ghost"}
      fontWeight="bold"
      fontSize={{ base: "14px", md: "20px" }}
      color="white"
      background={active ? "rgba(0,0,0,0.2)" : "transparent"}
      _hover={{ background: "rgba(0,0,0,0.2)" }}
      {...props}
    >
      {children}
    </Button>
  );
}
