import { HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ActionButton from "./ActionButton";
import { IconPlayerSkipForwardFilled } from "@tabler/icons-react";
import { useVibe } from "../../hooks/useVibe";
import { TIMER_OPTIONS } from "../../helpers/constants";
import OptionButton from "./OptionButton";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export default function TimerCount() {
  const [timeSeconds, setTimeSeconds] = useState(TIMER_OPTIONS[0].minutes * 60);
  const [playing, setPlaying] = useState(false);
  const { setColor, selectedOption, setSelectedOption } = useVibe();

  const intervalRef = useRef(null);

  const changeTimer = useCallback(
    (value) => {
      const optionData = TIMER_OPTIONS.find((option) => option.value === value);
      setColor(optionData.color);
      setSelectedOption(value);
      setPlaying(false);
      setTimeSeconds(optionData.minutes * 60);
    },
    [setColor, setSelectedOption]
  );

  const handleOptionClick = (value) => {
    changeTimer(value);
  };

  const handlePlayClick = () => {
    setPlaying(true);
  };

  const handlePauseClick = () => {
    setPlaying(false);
  };

  const getNextOption = useCallback(() => {
    const optionIndex = TIMER_OPTIONS.findIndex(
      (option) => option.value === selectedOption
    );
    let nextOptionIndex = optionIndex + 1;
    if (optionIndex == 2) nextOptionIndex = 0;
    const nextOptionData = TIMER_OPTIONS[nextOptionIndex];
    return nextOptionData;
  }, [selectedOption]);

  const handleSkipClick = () => {
    const nextOptionData = getNextOption();
    changeTimer(nextOptionData.value);
  };

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTimeSeconds((prevTime) => {
        if (prevTime === 0) {
          const nextOptionData = getNextOption();
          changeTimer(nextOptionData.value);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);
  }, [changeTimer, getNextOption]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (playing) startTimer();
    else {
      if (!intervalRef.current) return;

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [playing, startTimer]);

  return (
    <VStack py="54px" background="rgba(255,255,255,0.3)" borderRadius="10px">
      <HStack>
        {TIMER_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            active={selectedOption === option.value}
          >
            {option.name}
          </OptionButton>
        ))}
      </HStack>
      <Text
        fontSize="128px"
        fontWeight="bold"
        letterSpacing="-1.7%"
        color="white"
      >
        {formatTime(timeSeconds)}
      </Text>
      <HStack spacing="21px">
        {!playing && (
          <ActionButton onClick={handlePlayClick}>Start</ActionButton>
        )}
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
    </VStack>
  );
}
