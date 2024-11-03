import { VStack } from "@chakra-ui/react";
import TimerOptions from "./TimerOptions";
import TimerCount from "./TimerCount";
import TimerActions from "./TimerActions";
import TimerSettings from "./TimerSettings";
import FocusMusicSlider from "./FocusMusicSlider";
import TimerAudio from "./TimerAudio";
import { useTimer } from "../../hooks/useTimer";

export default function TimerSection() {
  const { isVisibleFocusMusicSetting } = useTimer();
  return (
    <>
      <VStack
        pt="30px"
        pb="0"
        background="rgba(255,255,255,0.3)"
        borderRadius="10px"
      >
        <TimerOptions />
        <TimerCount />
        <TimerActions />
        <TimerSettings />
      </VStack>
      {isVisibleFocusMusicSetting && <FocusMusicSlider />}
      <TimerAudio />
    </>
  );
}
