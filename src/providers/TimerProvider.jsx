import { createContext, useCallback, useEffect, useState } from "react";
import { TIMER_OPTIONS } from "../helpers/constants";
import { focusMusics } from "../services/focus-music";

export const TimerContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default function TimerProvider({ children }) {
  const [fisrtOption] = TIMER_OPTIONS;
  const [color, setColor] = useState(fisrtOption.color);
  const [selectedOption, setSelectedOption] = useState(fisrtOption.value);
  const [playing, setPlaying] = useState(false);
  const [focusMusic, setFocusMusic] = useState("none");
  const [focusBackground, setFocusBackground] = useState(null);
  const [focusBackgroundPreview, setFocusBackgroundPreview] = useState(null);
  const [isVisibleFocusMusicSetting, setIsVisibleFocusMusicSetting] =
    useState(false);

  const getNextOption = useCallback(() => {
    const optionIndex = TIMER_OPTIONS.findIndex(
      (option) => option.value === selectedOption
    );
    let nextOptionIndex = optionIndex + 1;
    if (optionIndex == 2) nextOptionIndex = 0;
    const nextOptionData = TIMER_OPTIONS[nextOptionIndex];
    return nextOptionData;
  }, [selectedOption]);

  useEffect(() => {
    if (focusMusic) {
      const musicData = focusMusics.find((music) => music.value === focusMusic);
      setFocusBackground(musicData.background);
    } else {
      setFocusBackground(null);
    }
  }, [focusMusic]);

  return (
    <TimerContext.Provider
      value={{
        color,
        setColor,
        selectedOption,
        setSelectedOption,
        playing,
        setPlaying,
        getNextOption,
        focusMusic,
        setFocusMusic,
        focusBackground,
        setFocusBackground,
        isVisibleFocusMusicSetting,
        setIsVisibleFocusMusicSetting,
        focusBackgroundPreview,
        setFocusBackgroundPreview,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
