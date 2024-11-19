import { createContext, useCallback, useState } from "react";
import { TIMER_OPTIONS, TIMER_ORDER } from "../helpers/constants";
import PropTypes from "prop-types";

export const TimerContext = createContext(null);

export default function TimerProvider({ children }) {
  const [fisrtOption] = TIMER_OPTIONS;
  const [selectedOption, setSelectedOption] = useState(fisrtOption.value);
  const [playing, setPlaying] = useState(false);
  const [playingAlarm, setPlayingAlarm] = useState(false);

  const [timerOrder, setTimerOrder] = useState(0);

  const setNextOption = useCallback(() => {
    let nextOrder = timerOrder + 1;
    if (selectedOption !== TIMER_ORDER[timerOrder]) {
      nextOrder =
        TIMER_ORDER.findIndex((order) => order === selectedOption) + 1;
    }
    if (nextOrder === TIMER_ORDER.length) nextOrder = 0;
    setTimerOrder(nextOrder);
    setSelectedOption(TIMER_ORDER[nextOrder]);
  }, [selectedOption, timerOrder]);

  const timerFinish = useCallback(() => {
    setPlaying(false);
  }, []);

  return (
    <TimerContext.Provider
      value={{
        selectedOption,
        setSelectedOption,
        playing,
        setPlaying,
        setNextOption,
        playingAlarm,
        setPlayingAlarm,
        timerFinish,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

TimerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
