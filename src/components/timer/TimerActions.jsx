import { HStack, IconButton } from "@chakra-ui/react";
import ActionButton from "./ActionButton";
import { IconPlayerSkipForwardFilled } from "@tabler/icons-react";
import { useTimer } from "../../hooks/useTimer";

export default function TimerActions() {
  const { playing, setPlaying, getNextOption, setSelectedOption, setPlayingAlarm } =
    useTimer();

  const handlePlayClick = () => {
    setPlaying(true);
  };

  const handlePauseClick = () => {
    setPlaying(false);
  };

  const handleSkipClick = () => {
    setPlaying(false);
    const nextOptionData = getNextOption();
    setSelectedOption(nextOptionData.value);
    setPlayingAlarm(true);
  };

  return (
    <HStack spacing="21px">
      {!playing && <ActionButton onClick={handlePlayClick}>Start</ActionButton>}
      {playing && (
        <>
          <ActionButton onClick={handlePauseClick}>Pause</ActionButton>
          <IconButton
            onClick={handleSkipClick}
            icon={<IconPlayerSkipForwardFilled size="30px" color="white" />}
            _hover={{ background: "rgba(0,0,0,0.2)" }}
            variant="ghost"
          />
        </>
      )}
    </HStack>
  );
}
