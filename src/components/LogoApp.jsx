import { Box, Heading, HStack } from "@chakra-ui/react";

export default function LogoApp() {
  return (
    <HStack spacing={{ base: "10px", md: "21px" }}>
      <Box
        height={{ base: "40px", md: "60px" }}
        width={{ base: "40px", md: "60px" }}
        backgroundColor="white"
        borderRadius="full"
      ></Box>
      <Heading as="h1" color="white" fontSize={{ base: "24px", md: "40px" }}>
        <Box as="span" fontWeight="extrabold" letterSpacing="2%">
          Focus
        </Box>{" "}
        <Box as="span" fontWeight="normal">
          Sphere
        </Box>
      </Heading>
    </HStack>
  );
}
