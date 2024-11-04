import { VStack } from "@chakra-ui/react";
import TimerOptions from "./TimerOptions";
import TimerCount from "./TimerCount";
import TimerActions from "./TimerActions";
import TimerSettings from "./TimerSettings";
import FocusMusicSlider from "./FocusMusicSlider";
import { useTimer } from "../../hooks/useTimer";
import FocusMusicPlayer from "./FocusMusicPlayer";
import AlarmSlider from "./AlarmSlider";
import AlarmPlayer from "./AlarmPlayer";

export default function TimerSection() {
  const { isVisibleFocusMusicSetting, isVisibleAlarmSetting } = useTimer();
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
      {isVisibleAlarmSetting && <AlarmSlider />}
      <FocusMusicPlayer />
      <AlarmPlayer />
    </>
  );
}
