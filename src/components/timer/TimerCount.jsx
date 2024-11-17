import { Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { useTasks } from "../../hooks/useTasks";
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
    setPlayingAlarm,
  } = useTimer();
  const { increaseActCycle } = useTasks();

  const intervalRef = useRef(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setTimeSeconds((prevTime) => {
        if (prevTime === 0) {
          clearInterval(intervalRef.current);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (timeSeconds === 0) setPlaying(false);
  }, [setPlaying, timeSeconds]);

  useEffect(() => {
    if (timeSeconds === 0 && playing) {
      if (selectedOption === TIMER_OPTIONS[0].value) increaseActCycle();
      const nextOptionData = getNextOption();
      setSelectedOption(nextOptionData.value);
      setPlayingAlarm(true);
    }
  }, [
    getNextOption,
    increaseActCycle,
    playing,
    selectedOption,
    setPlayingAlarm,
    setSelectedOption,
    timeSeconds,
  ]);

  useEffect(() => {
    if (playing) startTimer();
    else {
      if (!intervalRef.current) return;

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [playing, startTimer]);

  useEffect(() => {
    const optionData = TIMER_OPTIONS.find(
      (option) => option.value === selectedOption
    );
    setColor(optionData.color);
    setPlaying(false);
    setTimeSeconds(optionData.minutes * 60);
  }, [selectedOption, setColor, setPlaying]);

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
