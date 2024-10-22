import { Box, Heading, HStack } from "@chakra-ui/react";

export default function LogoApp() {
  return (
    <HStack spacing="21px">
      <Box
        height="60px"
        width="60px"
        backgroundColor="white"
        borderRadius="full"
      ></Box>
      <Heading as="h1" color="white" fontSize="40px">
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
