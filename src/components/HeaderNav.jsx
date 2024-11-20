import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import LogoApp from "./LogoApp";
import { IconMenu2, IconSettings, IconUser } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../hooks/useSettings";

export default function HeaderNav() {
  const navigate = useNavigate();
  const { authUsername, signOut } = useAuth();
  const { openSettings } = useSettings();
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <HStack justify="space-between" py="14px" borderBottom="1px solid white">
      <LogoApp />
      {isLargeScreen && (
        <HStack spacing="17px">
          <Button leftIcon={<IconSettings />} onClick={openSettings}>
            Setting
          </Button>
          {!authUsername && (
            <Button
              leftIcon={<IconUser />}
              onClick={() => navigate("/sign-up")}
            >
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
      )}

      {!isLargeScreen && (
        <>
          <IconButton icon={<IconMenu2 />} onClick={onOpen} />
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xs"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader textAlign={"center"}>{authUsername}</ModalHeader>

              <ModalCloseButton />
              <ModalBody pb={"20px"}>
                <VStack spacing="10px" mt={authUsername ? 0 : "10px"}>
                  <Button
                    leftIcon={<IconSettings />}
                    onClick={openSettings}
                    width={"full"}
                  >
                    Setting
                  </Button>
                  {!authUsername && (
                    <Button
                      leftIcon={<IconUser />}
                      onClick={() => navigate("/sign-up")}
                      width={"full"}
                    >
                      Sign up
                    </Button>
                  )}

                  {authUsername && (
                    <Button
                      variant={"ghost"}
                      colorScheme="red"
                      onClick={signOut}
                      width={"full"}
                    >
                      Logout
                    </Button>
                  )}
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </HStack>
  );
}
