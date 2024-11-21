import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import ModalSettings from "../components/settings/ModalSettings";
import { useDisclosure } from "@chakra-ui/react";
import { API_URL, FOCUS_MUSICS, TIMER_OPTIONS } from "../helpers/constants";
import { useAuth } from "../hooks/useAuth";

export const SettingsContext = createContext(null);

export default function SettingsProvider({ children }) {
  const { authUsername } = useAuth();
  const [fisrtOption] = TIMER_OPTIONS;
  const [timerDuration, setTimerDuration] = useState({
    "focus-time": 25,
    "short-break": 5,
    "long-break": 10,
  });
  const [focusMusic, setFocusMusic] = useState("none");
  const [alarm, setAlarm] = useState("none");
  const [color, setColor] = useState(fisrtOption.color);
  const [focusBackground, setFocusBackground] = useState(null);
  const [focusBackgroundPreview, setFocusBackgroundPreview] = useState(null);
  const [isVisibleFocusMusicSetting, setIsVisibleFocusMusicSetting] =
    useState(false);
  const [isVisibleAlarmSetting, setIsVisibleAlarmSetting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useLayoutEffect(() => {
    if (isVisibleFocusMusicSetting) setIsVisibleAlarmSetting(false);
  }, [isVisibleFocusMusicSetting]);

  useLayoutEffect(() => {
    if (isVisibleAlarmSetting) setIsVisibleFocusMusicSetting(false);
  }, [isVisibleAlarmSetting]);

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

  const fetchSettings = useCallback(async () => {
    if (!authUsername) return;
    const resp = await fetch(API_URL + "/setting/" + authUsername);

    if (!resp.ok) {
      setTimerDuration({
        "focus-time": 25,
        "short-break": 5,
        "long-break": 10,
      });
      setFocusMusic("none");
      setAlarm("none");
    }

    const json = await resp.json();

    setTimerDuration({
      "focus-time": parseInt(json.data[0].pomodoro),
      "short-break": parseInt(json.data[0].short),
      "long-break": parseInt(json.data[0].long),
    });

    setFocusMusic(json.data[0].backsound);
    setAlarm(json.data[0].alarm);
  }, [authUsername]);

  // {
  //   pomodoro: timerDuration["focus-time"].toString(),
  //   short: timerDuration["short-break"].toString(),
  //   long: timerDuration["long-break"].toString(),
  //   alarm: alarm,
  //   backsound: focusMusic,
  // }

  const editSettings = useCallback(
    async (settings) => {
      if (!authUsername) return;
      const resp = await fetch(API_URL + "/setting/" + authUsername, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (resp.ok) fetchSettings();
    },
    [authUsername, fetchSettings]
  );

  const updateSettings = useCallback(
    (newDuration, newFocusMusic, newAlarm) => {
      setTimerDuration(newDuration);
      setFocusMusic(newFocusMusic);
      setAlarm(newAlarm);
      editSettings({
        pomodoro: newDuration["focus-time"].toString(),
        short: newDuration["short-break"].toString(),
        long: newDuration["long-break"].toString(),
        alarm: newAlarm,
        backsound: newFocusMusic,
      });
    },
    [editSettings]
  );

  const updateAlarm = useCallback(
    (newAlarm) => {
      setAlarm(newAlarm);
      editSettings({
        pomodoro: timerDuration["focus-time"].toString(),
        short: timerDuration["short-break"].toString(),
        long: timerDuration["long-break"].toString(),
        alarm: newAlarm,
        backsound: focusMusic,
      });
    },
    [editSettings, focusMusic, timerDuration]
  );

  const updateFocusMusic = useCallback(
    (newFocusMusic) => {
      setFocusMusic(newFocusMusic);
      editSettings({
        pomodoro: timerDuration["focus-time"].toString(),
        short: timerDuration["short-break"].toString(),
        long: timerDuration["long-break"].toString(),
        alarm: alarm,
        backsound: newFocusMusic,
      });
    },
    [alarm, editSettings, timerDuration]
  );

  const addSettings = useCallback(
    async (username) => {
      const resp = await fetch(API_URL + "/setting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          pomodoro: timerDuration["focus-time"].toString(),
          short: timerDuration["short-break"].toString(),
          long: timerDuration["long-break"].toString(),
          alarm: alarm,
          backsound: focusMusic,
        }),
      });

      if (resp.ok) fetchSettings();
    },
    [alarm, fetchSettings, focusMusic, timerDuration]
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider
      value={{
        timerDuration,
        setTimerDuration,
        openSettings: onOpen,
        closeSettings: onClose,
        focusMusic,
        setFocusMusic,
        alarm,
        setAlarm,
        color,
        setColor,
        focusBackground,
        setFocusBackground,
        isVisibleFocusMusicSetting,
        setIsVisibleFocusMusicSetting,
        focusBackgroundPreview,
        setFocusBackgroundPreview,
        isVisibleAlarmSetting,
        setIsVisibleAlarmSetting,
        updateSettings,
        addSettings,
        updateAlarm,
        updateFocusMusic,
      }}
    >
      {children}
      <ModalSettings isOpen={isOpen} onClose={onClose} />
    </SettingsContext.Provider>
  );
}

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
