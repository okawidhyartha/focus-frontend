import { Box, IconButton, Text, useBreakpointValue } from "@chakra-ui/react";
import { useSettings } from "../hooks/useSettings";
import { IconMenu2 } from "@tabler/icons-react";
import { useTimer } from "../hooks/useTimer";

const MobileHeaderNav = () => {
  const { color, onOpenMenu } = useSettings();
  const { timerVisible } = useTimer();
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <Box
      width={"full"}
      height={"64px"}
      background={"rgba(0, 0, 0, 0.8)"}
      backdropFilter={"blur(10px)"}
      position={"fixed"}
      display={"flex"}
      alignItems={"center"}
      px={4}
      top={0}
      zIndex={100}
      gap={4}
      transform={
        !timerVisible && !isLargeScreen ? "translateY(0)" : "translateY(-64px)"
      }
      transition={"transform 0.3s"}
    >
      <Box
        boxSize={4}
        borderRadius={"full"}
        backgroundColor={color}
        ml={2}
      ></Box>
      <Text
        fontWeight="bold"
        letterSpacing="-1.7%"
        fontSize={"lg"}
        id="smallTimer"
        color={"white"}
        onClick={scrollToTop}
      ></Text>
      <IconButton
        icon={<IconMenu2 color="white" />}
        variant={"unstyled"}
        display={"flex"}
        alignItems={"center"}
        marginLeft={"auto"}
        onClick={onOpenMenu}
      />
    </Box>
  );
};

export default MobileHeaderNav;
