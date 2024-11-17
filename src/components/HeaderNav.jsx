import {
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import LogoApp from "./LogoApp";
import { IconSettings, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HeaderNav() {
  const navigate = useNavigate();
  const { authUsername, signOut } = useAuth();

  return (
    <HStack justify="space-between" py="14px" borderBottom="1px solid white">
      <LogoApp />
      <HStack spacing="17px">
        <Button leftIcon={<IconSettings />}>Setting</Button>
        {!authUsername && (
          <Button leftIcon={<IconUser />} onClick={() => navigate("/sign-up")}>
            Sign up
          </Button>
        )}

        {authUsername && (
          <Popover>
            <PopoverTrigger>
              <Button leftIcon={<IconUser />}>{authUsername}</Button>
            </PopoverTrigger>
            <PopoverContent width={200}>
              <PopoverArrow />
              <PopoverBody>
                <Button
                  width={"100%"}
                  variant={"ghost"}
                  colorScheme="red"
                  onClick={signOut}
                >
                  Logout
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </HStack>
    </HStack>
  );
}
