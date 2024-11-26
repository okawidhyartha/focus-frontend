import {
  Box,
  Grid,
  GridItem,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import HeaderNav from "../../components/HeaderNav";
import { useTimer } from "../../hooks/useTimer";
import TimerSection from "../../components/timer/TimerSection";
import { useEffect, useRef, useState } from "react";
import TasksSection from "../../components/tasks/TasksSection";
import TaskSelectedSection from "../../components/tasks/TaskSelectedSection";
import { useSettings } from "../../hooks/useSettings";
import { AnimatePresence, motion } from "motion/react";

export default function TimerPage() {
  const { selectedOption, playing } = useTimer();
  const isLargeDevice = useBreakpointValue({ base: false, lg: true });
  const { color, focusBackground, focusBackgroundPreview } = useSettings();
  const [selectedTaskVisible, setSelectedTaskVisible] = useState(false);
  const selectedTaskRef = useRef(null);

  const [prevFocusBackgroundPreview, setPrevFocusBackgroundPreview] =
    useState(null);

  useEffect(() => {
    if (focusBackgroundPreview)
      setPrevFocusBackgroundPreview(focusBackgroundPreview);
  }, [focusBackgroundPreview]);

  useEffect(() => {
    if (selectedTaskRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => setSelectedTaskVisible(entry.isIntersecting),
        { threshold: [0] }
      );

      observer.observe(selectedTaskRef.current);
    }
  }, [selectedTaskRef]);

  return (
    <Box
      backgroundColor={
        (focusBackground && playing && selectedOption === "focusTime") ||
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
          focusBackground && playing && selectedOption === "focusTime" ? 1 : 0
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
        px={{ base: "20px", md: "77px" }}
        py={{ base: "10px", md: "50px" }}
        zIndex={3}
      >
        <HeaderNav />
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }}
          mt={{ base: "40px", md: "62px" }}
          columnGap={"40px"}
          rowGap={"40px"}
        >
          <GridItem width="100%">
            <VStack
              width={"100%"}
              position={{ base: "unset", lg: "sticky" }}
              top={{ base: "unset", lg: "20px" }}
              gap={"30px"}
            >
              <AnimatePresence mode="popLayout">
                {!selectedTaskVisible && isLargeDevice && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    style={{ width: "100%" }}
                  >
                    <TaskSelectedSection />
                  </motion.div>
                )}
              </AnimatePresence>
              <TimerSection />
            </VStack>
          </GridItem>
          <GridItem width="100%">
            <VStack width={"100%"} gap={["40px", "20px"]}>
              <Box ref={selectedTaskRef}>
                <TaskSelectedSection />
              </Box>
              <TasksSection />
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
