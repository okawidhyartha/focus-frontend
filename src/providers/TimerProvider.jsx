import { createContext, useCallback, useState } from "react";
import { TIMER_OPTIONS } from "../helpers/constants";

export const TimerContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default function TimerProvider({ children }) {
  const [fisrtOption] = TIMER_OPTIONS;
  const [color, setColor] = useState(fisrtOption.color);
  const [selectedOption, setSelectedOption] = useState(fisrtOption.value);
  const [playing, setPlaying] = useState(false);

  const getNextOption = useCallback(() => {
    const optionIndex = TIMER_OPTIONS.findIndex(
      (option) => option.value === selectedOption
    );
    let nextOptionIndex = optionIndex + 1;
    if (optionIndex == 2) nextOptionIndex = 0;
    const nextOptionData = TIMER_OPTIONS[nextOptionIndex];
    return nextOptionData;
  }, [selectedOption]);

  return (
    <TimerContext.Provider
      value={{
        color,
        setColor,
        selectedOption,
        setSelectedOption,
        playing,
        setPlaying,
        getNextOption
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
