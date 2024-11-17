import { createContext, useCallback, useEffect, useState } from "react";
import { FOCUS_MUSICS, TIMER_OPTIONS, TIMER_ORDER } from "../helpers/constants";

export const TimerContext = createContext(null);

// eslint-disable-next-line react/prop-types
export default function TimerProvider({ children }) {
  const [fisrtOption] = TIMER_OPTIONS;
  const [color, setColor] = useState(fisrtOption.color);
  const [selectedOption, setSelectedOption] = useState(fisrtOption.value);
  const [playing, setPlaying] = useState(false);
  const [playingAlarm, setPlayingAlarm] = useState(false);
  const [focusMusic, setFocusMusic] = useState("none");
  const [alarm, setAlarm] = useState("none");
  const [focusBackground, setFocusBackground] = useState(null);
  const [focusBackgroundPreview, setFocusBackgroundPreview] = useState(null);
  const [isVisibleFocusMusicSetting, setIsVisibleFocusMusicSetting] =
    useState(false);
  const [isVisibleAlarmSetting, setIsVisibleAlarmSetting] = useState(false);
  const [timerOrder, setTimerOrder] = useState(0);

  const setNextOption = useCallback(() => {
    let nextOrder = timerOrder + 1;
    if (selectedOption !== TIMER_ORDER[timerOrder]) {
      nextOrder = TIMER_ORDER.findIndex((order) => order === selectedOption) + 1;
    }
    if (nextOrder === TIMER_ORDER.length) nextOrder = 0;
    setTimerOrder(nextOrder);
    setSelectedOption(TIMER_ORDER[nextOrder]);
  }, [selectedOption, timerOrder]);

  const timerFinish = useCallback(() => {
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (focusMusic) {
      const musicData = FOCUS_MUSICS.find(
        (music) => music.value === focusMusic
      );
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
        setNextOption,
        focusMusic,
        setFocusMusic,
        focusBackground,
        setFocusBackground,
        isVisibleFocusMusicSetting,
        setIsVisibleFocusMusicSetting,
        focusBackgroundPreview,
        setFocusBackgroundPreview,
        alarm,
        setAlarm,
        playingAlarm,
        setPlayingAlarm,
        isVisibleAlarmSetting,
        setIsVisibleAlarmSetting,
        timerFinish,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
