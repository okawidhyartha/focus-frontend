import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import ModalSettings from "../components/settings/ModalSettings";
import { useDisclosure, useToast } from "@chakra-ui/react";
import {
  API_URL,
  FOCUS_MUSICS,
  GUEST_USERNAME,
  TIMER_OPTIONS,
} from "../helpers/constants";
import { useAuth } from "../hooks/useAuth";
import { useIndexedDB } from "react-indexed-db-hook";

const editSettingsServer = async (username, settings) => {
  const resp = await fetch(API_URL + "/setting/" + username, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!resp.ok) {
    if (resp.status === 404) return null;
    else throw new Error("Something went wrong when updating your settings.");
  }

  return await resp.json();
};

const addSettingsServer = async (settings) => {
  const resp = await fetch(API_URL + "/setting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!resp.ok) {
    throw new Error("Something went wrong when adding your settings.");
  }

  return await resp.json();
};

const fetchSettingsServer = async (username) => {
  const resp = await fetch(API_URL + "/setting/" + username);

  if (!resp.ok) {
    if (resp.status === 404) return null;
    else throw new Error("Something went wrong when fetching your settings.");
  }

  const json = await resp.json();
  return json.data[0];
};

export const SettingsContext = createContext(null);

const DEFAULT_TIMER_DURATION = {
  focusTime: 25,
  shortBreak: 5,
  longBreak: 10,
};
const DEFAULT_FOCUS_MUSIC = "none";
const DEFAULT_ALARM = "none";

export default function SettingsProvider({ children }) {
  const { authUsername } = useAuth();
  const { update: editSettingIDB, getByID: getSettingIDB } =
    useIndexedDB("settings");

  const [fisrtOption] = TIMER_OPTIONS;
  const [timerDuration, setTimerDuration] = useState(DEFAULT_TIMER_DURATION);
  const [focusMusic, setFocusMusic] = useState(DEFAULT_FOCUS_MUSIC);
  const [alarm, setAlarm] = useState(DEFAULT_ALARM);
  const [color, setColor] = useState(fisrtOption.color);
  const [focusBackground, setFocusBackground] = useState(null);
  const [focusBackgroundPreview, setFocusBackgroundPreview] = useState(null);
  const [isVisibleFocusMusicSetting, setIsVisibleFocusMusicSetting] =
    useState(false);
  const [isVisibleAlarmSetting, setIsVisibleAlarmSetting] = useState(false);
  const toast = useToast();
  const toastSyncRef = useRef();
  const [updating, setUpdating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [adding, setAdding] = useState(false);

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

  const syncSettings = useCallback(async () => {
    if (!authUsername) return;
    const localSettings = await getSettingIDB(authUsername);
    if (!localSettings) return;
    setSyncing(true);
    toastSyncRef.current = toast({
      title: "Syncing settings...",
      status: "loading",
      isClosable: false,
      position: "top-right",
    });
    if (localSettings.synced) {
      const serverSettings = await fetchSettingsServer(authUsername);
      await editSettingIDB({
        username: authUsername,
        focusTime: serverSettings.pomodoro,
        shortBreak: serverSettings.short,
        longBreak: serverSettings.longBreak,
        focusMusic: serverSettings.backsound,
        alarm: serverSettings.alarm,
        synced: true,
      });

      setTimerDuration({
        focusTime: parseInt(serverSettings.pomodoro),
        shortBreak: parseInt(serverSettings.short),
        longBreak: parseInt(serverSettings.longBreak),
      });

      setFocusMusic(serverSettings.backsound);
      setAlarm(serverSettings.alarm);
    } else {
      try {
        const resp = await editSettingsServer(authUsername, {
          pomodoro: localSettings.focusTime,
          short: localSettings.shortBreak,
          long: localSettings.longBreak,
          alarm: localSettings.alarm,
          backsound: localSettings.focusMusic,
        });

        if (resp === null) {
          // not found
          await addSettingsServer({
            username: authUsername,
            pomodoro: localSettings.focusTime,
            short: localSettings.shortBreak,
            long: localSettings.longBreak,
            alarm: localSettings.alarm,
            backsound: localSettings.focusMusic,
          });

          await editSettingIDB({
            ...localSettings,
            synced: true,
          });

          setTimerDuration({
            focusTime: parseInt(localSettings.focusTime),
            shortBreak: parseInt(localSettings.shortBreak),
            longBreak: parseInt(localSettings.longBreak),
          });

          setFocusMusic(localSettings.focusMusic);
          setAlarm(localSettings.alarm);
        } else {
          await editSettingIDB({
            ...localSettings,
            synced: true,
          });

          setTimerDuration({
            focusTime: parseInt(localSettings.focusTime),
            shortBreak: parseInt(localSettings.shortBreak),
            longBreak: parseInt(localSettings.longBreak),
          });

          setFocusMusic(localSettings.focusMusic);
          setAlarm(localSettings.alarm);
        }
      } catch {
        throw new Error("Something went wrong when syncing your settings.");
      }
    }
    setSyncing(false);
    toast.close(toastSyncRef.current);
  }, [authUsername, editSettingIDB, getSettingIDB, toast]);

  const fetchSettings = useCallback(async () => {
    const username = authUsername ?? GUEST_USERNAME;
    let _timerDuration = DEFAULT_TIMER_DURATION;
    let _focusMusic = DEFAULT_FOCUS_MUSIC;
    let _alarm = DEFAULT_ALARM;

    const localSettings = await getSettingIDB(username);
    if (!localSettings) {
      editSettingIDB({
        username,
        focusTime: _timerDuration.focusTime,
        shortBreak: _timerDuration.shortBreak,
        longBreak: _timerDuration.longBreak,
        focusMusic: _focusMusic,
        alarm: _alarm,
        synced: true,
      });
    } else {
      _timerDuration = {
        focusTime: parseInt(localSettings.focusTime),
        shortBreak: parseInt(localSettings.shortBreak),
        longBreak: parseInt(localSettings.longBreak),
      };
      _focusMusic = localSettings.focusMusic;
      _alarm = localSettings.alarm;
    }

    setTimerDuration(_timerDuration);
    setFocusMusic(_focusMusic);
    setAlarm(_alarm);

    if (authUsername && localSettings) syncSettings();
  }, [authUsername, editSettingIDB, getSettingIDB, syncSettings]);

  const editSettings = useCallback(
    async (settings) => {
      setUpdating(true);
      const username = authUsername ?? GUEST_USERNAME;
      let synced = false;

      if (authUsername && navigator.onLine) {
        try {
          await editSettingsServer(authUsername, {
            pomodoro: settings.focusTime,
            short: settings.shortBreak,
            long: settings.longBreak,
            alarm: settings.alarm,
            backsound: settings.focusMusic,
          });
          synced = true;
        } catch {
          synced = false;
        }
      }

      await editSettingIDB({
        username,
        focusTime: settings.focusTime,
        shortBreak: settings.shortBreak,
        longBreak: settings.longBreak,
        focusMusic: settings.focusMusic,
        alarm: settings.alarm,
        synced,
      });

      setTimerDuration({
        focusTime: parseInt(settings.focusTime),
        shortBreak: parseInt(settings.shortBreak),
        longBreak: parseInt(settings.longBreak),
      });

      setFocusMusic(settings.focusMusic);
      setAlarm(settings.alarm);

      setUpdating(false);
    },
    [authUsername, editSettingIDB]
  );

  const updateAlarm = useCallback(
    (newAlarm) => {
      editSettings({
        focusTime: timerDuration["focusTime"].toString(),
        shortBreak: timerDuration["shortBreak"].toString(),
        longBreak: timerDuration["longBreak"].toString(),
        alarm: newAlarm,
        focusMusic: focusMusic,
      });
    },
    [editSettings, focusMusic, timerDuration]
  );

  const updateFocusMusic = useCallback(
    (newFocusMusic) => {
      setFocusMusic(newFocusMusic);
      editSettings({
        focusTime: timerDuration["focusTime"].toString(),
        shortBreak: timerDuration["shortBreak"].toString(),
        longBreak: timerDuration["longBreak"].toString(),
        alarm: alarm,
        focusMusic: newFocusMusic,
      });
    },
    [alarm, editSettings, timerDuration]
  );

  const addSettings = useCallback(
    async (username) => {
      setAdding(true);
      let synced = false;

      if (navigator.onLine && username !== GUEST_USERNAME) {
        try {
          await addSettingsServer({
            username,
            pomodoro: timerDuration["focusTime"].toString(),
            short: timerDuration["shortBreak"].toString(),
            long: timerDuration["longBreak"].toString(),
            alarm: alarm,
            backsound: focusMusic,
          });
          synced = true;
        } catch {
          synced = false;
        }
      }

      await editSettingIDB({
        username,
        focusTime: timerDuration["focusTime"],
        shortBreak: timerDuration["shortBreak"],
        longBreak: timerDuration["longBreak"],
        focusMusic: focusMusic,
        alarm: alarm,
        synced,
      });

      setAdding(false);
    },
    [alarm, editSettingIDB, focusMusic, timerDuration]
  );

  const handleSync = useCallback(() => {
    if (!syncing && authUsername && navigator.onLine) syncSettings();
  }, [syncing, authUsername, syncSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    window.addEventListener("online", handleSync);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener("online", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, [handleSync]);

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
        editSettings,
        addSettings,
        updateAlarm,
        updateFocusMusic,
        updating,
        syncing,
        adding,
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
