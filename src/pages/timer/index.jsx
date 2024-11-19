import { Box, Grid, GridItem } from "@chakra-ui/react";
import HeaderNav from "../../components/HeaderNav";
import { useTimer } from "../../hooks/useTimer";
import TimerSection from "../../components/timer/TimerSection";
import { useEffect, useState } from "react";
import TasksSection from "../../components/tasks/TasksSection";
import TaskSelectedSection from "../../components/tasks/TaskSelectedSection";
import { useSettings } from "../../hooks/useSettings";

export default function TimerPage() {
  const { selectedOption, playing } = useTimer();
  const { color, focusBackground, focusBackgroundPreview } = useSettings();

  const [prevFocusBackgroundPreview, setPrevFocusBackgroundPreview] =
    useState(null);

  useEffect(() => {
    if (focusBackgroundPreview)
      setPrevFocusBackgroundPreview(focusBackgroundPreview);
  }, [focusBackgroundPreview]);

  return (
    <Box
      backgroundColor={
        (focusBackground && playing && selectedOption === "focus-time") ||
        focusBackgroundPreview
          ? "black"
          : color
      }
      position="relative"
      transition="background-color 1s"
    >
      <Box
        position="absolute"
        width="100%"
        height="100%"
        backgroundColor="black"
        backgroundImage={
          focusBackground
            ? `linear-gradient(transparent, black 200%), url(${focusBackground})`
            : ""
        }
        opacity={
          focusBackground && playing && selectedOption === "focus-time" ? 1 : 0
        }
        backgroundSize="cover"
        transition="opacity 1s, background-image 1s"
        filter="brightness(0.3)"
      />
      <Box
        position="absolute"
        width="100%"
        height="100%"
        backgroundColor="black"
        backgroundImage={
          prevFocusBackgroundPreview
            ? `linear-gradient(transparent, black 200%), url(${prevFocusBackgroundPreview})`
            : ""
        }
        opacity={focusBackgroundPreview ? 1 : 0}
        backgroundSize="cover"
        transition="opacity 1s, background-image 1s"
        filter="brightness(0.3)"
      />
      <Box
        position="relative"
        width="100%"
        minHeight="100vh"
        height="100%"
        px="77px"
        py="50px"
        zIndex={3}
      >
        <HeaderNav />
        <Grid templateColumns="repeat(2, 1fr)" mt="62px" columnGap={"40px"}>
          <GridItem width="100%">
            <TimerSection />
          </GridItem>
          <GridItem width="100%">
            <TaskSelectedSection />
            <TasksSection />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
