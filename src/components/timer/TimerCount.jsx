import { Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { TIMER_OPTIONS } from "../../helpers/constants";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export default function TimerCount() {
  const [timeSeconds, setTimeSeconds] = useState(TIMER_OPTIONS[0].minutes * 60);
  const {
    setColor,
    selectedOption,
    setSelectedOption,
    getNextOption,
    playing,
    setPlaying,
    setPlayingAlarm
  } = useTimer();

  const intervalRef = useRef(null);

  const changeTimer = useCallback(() => {
    const optionData = TIMER_OPTIONS.find(
      (option) => option.value === selectedOption
    );
    setColor(optionData.color);
    setPlaying(false);
    setTimeSeconds(optionData.minutes * 60);
  }, [setColor, selectedOption, setPlaying]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTimeSeconds((prevTime) => {
        if (prevTime === 0) {
          const nextOptionData = getNextOption();
          setSelectedOption(nextOptionData.value);
          setPlayingAlarm(true);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);
  }, [getNextOption, setSelectedOption]);

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

  useEffect(() => {
    changeTimer();
  }, [selectedOption, changeTimer]);

  return (
    <Text
      fontSize="128px"
      fontWeight="bold"
      letterSpacing="-1.7%"
      color={"white"}
    >
      {formatTime(timeSeconds)}
    </Text>
  );
}
