import { Portal, Text } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { useTasks } from "../../hooks/useTasks";
import { TIMER_OPTIONS } from "../../helpers/constants";
import { useSettings } from "../../hooks/useSettings";
import { motion } from "motion/react";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

export default function TimerCount() {
  const { timerDuration } = useSettings();
  const {
    selectedOption,
    setSelectedOption,
    setNextOption,
    playing,
    setPlaying,
    setPlayingAlarm,
    setTimerVisible,
  } = useTimer();

  const { setColor } = useSettings();
  const smallTImerContainerRef = useRef(null);
  const containerRef = useRef(null);
  const currentTimerDuration = useRef(timerDuration);

  useEffect(() => {
    if (containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setTimerVisible(entry.isIntersecting);
        },
        { threshold: [0] }
      );

      observer.observe(containerRef.current);
    }
  }, [containerRef, setTimerVisible]);

  useEffect(() => {
    smallTImerContainerRef.current = document.getElementById("smallTimer");
  }, [smallTImerContainerRef]);

  const [timeSeconds, setTimeSeconds] = useState(
    timerDuration[selectedOption] * 60
  );
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
      setNextOption();
      setPlayingAlarm(true);
    }
  }, [
    setNextOption,
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
    currentTimerDuration.current = timerDuration;
  }, [timerDuration]);

  useEffect(() => {
    const optionData = TIMER_OPTIONS.find(
      (option) => option.value === selectedOption
    );
    setColor(optionData.color);
    setPlaying(false);
    setTimeSeconds(currentTimerDuration.current[selectedOption] * 60);
  }, [selectedOption, setColor, setPlaying]);

  return (
    <>
      <Text
        as={motion.p}
        layout
        fontSize={{ base: "50px", md: "128px" }}
        fontWeight="bold"
        letterSpacing="-1.7%"
        color={"white"}
        ref={containerRef}
      >
        {formatTime(timeSeconds)}
      </Text>
      <Portal containerRef={smallTImerContainerRef}>
        {formatTime(timeSeconds)}
      </Portal>
    </>
  );
}
