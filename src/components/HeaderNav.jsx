import { Button, HStack } from "@chakra-ui/react";
import LogoApp from "./LogoApp";
import { IconSettings, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function HeaderNav() {
  const navigate = useNavigate();

  return (
    <HStack justify="space-between" py="14px" borderBottom="1px solid white">
      <LogoApp />
      <HStack spacing="17px">
        <Button leftIcon={<IconSettings />}>Setting</Button>
        <Button leftIcon={<IconUser />} onClick={() => navigate("/sign-up")}>Sign up</Button>
      </HStack>
    </HStack>
  );
}
