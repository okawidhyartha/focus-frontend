import { Button, HStack } from "@chakra-ui/react";
import LogoApp from "./LogoApp";
import { IconSettings, IconUser } from "@tabler/icons-react";

export default function HeaderNav() {
  return (
    <HStack justify="space-between" py="14px" borderBottom="1px solid white">
      <LogoApp />
      <HStack spacing="17px">
        <Button leftIcon={<IconSettings />}>Setting</Button>
        <Button leftIcon={<IconUser />}>Sign In</Button>
      </HStack>
    </HStack>
  );
}
