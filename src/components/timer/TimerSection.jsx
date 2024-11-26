import { Box, VStack } from "@chakra-ui/react";
import TimerOptions from "./TimerOptions";
import TimerCount from "./TimerCount";
import TimerActions from "./TimerActions";
import TimerSettings from "./TimerSettings";
import FocusMusicSlider from "./FocusMusicSlider";
import FocusMusicPlayer from "./FocusMusicPlayer";
import AlarmSlider from "./AlarmSlider";
import AlarmPlayer from "./AlarmPlayer";
import { useSettings } from "../../hooks/useSettings";
import { motion, AnimatePresence } from "motion/react";

export default function TimerSection() {
  const { isVisibleFocusMusicSetting, isVisibleAlarmSetting } = useSettings();

  return (
    <Box as={motion.div} layout width={"full"}>
      <VStack
        as={motion.div}
        layout
        pt={{ base: "20px", md: "30px" }}
        pb="0"
        background="rgba(255,255,255,0.3)"
        borderRadius="10px"
        width={"full"}
      >
        <TimerOptions />
        <TimerCount />
        <TimerActions />
        <TimerSettings />
      </VStack>
      <AnimatePresence mode="wait">
        {isVisibleFocusMusicSetting && <FocusMusicSlider />}
        {isVisibleAlarmSetting && <AlarmSlider />}
      </AnimatePresence>
      <FocusMusicPlayer />
      <AlarmPlayer />
    </Box>
  );
}
