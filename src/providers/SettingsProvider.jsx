import {
  createContext,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import PropTypes from "prop-types";
import ModalSettings from "../components/settings/ModalSettings";
import { Toast, useDisclosure } from "@chakra-ui/react";
import { API_URL, FOCUS_MUSICS, TIMER_OPTIONS } from "../helpers/constants";
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

  if (!resp.ok)
    throw new Error(
      "Something went wrong when updating your settings. Please try again."
    );
};

export const SettingsContext = createContext(null);

export default function SettingsProvider({ children }) {
  const { authUsername } = useAuth();
  const {
    getAll: getAllSettingsIDB,
    add: addSettingIDB,
    update: editSettingIDB,
    getByID: getSettingIDB,
  } = useIndexedDB("settings");

  const {
    deleteRecord: deleteSettingSyncUpdate,
    getByID: getSettingSyncUpdate,
    update: editSettingSyncUpdate,
    add: addSettingSyncUpdate,
  } = useIndexedDB("settingsSyncUpdate");

  const [fisrtOption] = TIMER_OPTIONS;
  const [timerDuration, setTimerDuration] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 10,
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

  const syncSettings = useCallback(async () => {
    if (!authUsername) return;
    try {
      const settingsSyncUpdate = await getSettingSyncUpdate(authUsername);
      if (settingsSyncUpdate) {
        await editSettingsServer(authUsername, {
          pomodoro: settingsSyncUpdate.focusTime,
          short: settingsSyncUpdate.shortBreak,
          long: settingsSyncUpdate.longBreak,
          alarm: settingsSyncUpdate.alarm,
          backsound: settingsSyncUpdate.alarm,
        });
      }

      await deleteSettingSyncUpdate(authUsername);

      const resp = await fetch(API_URL + "/setting/" + authUsername);
      const json = await resp.json();
      const settingsServer = json.data[0];
      const settingsLocal = await getSettingIDB(authUsername);
      if (settingsLocal) {
        addSettingIDB({
          username: authUsername,
          focusTime: settingsServer.pomodoro,
          shortBreak: settingsServer.short,
          longBreak: settingsServer.longBreak,
          focusMusic: settingsServer.backsound,
          alarm: settingsServer.alarm,
        });
      } else {
        editSettingIDB({
          username: authUsername,
          focusTime: settingsServer.pomodoro,
          shortBreak: settingsServer.short,
          longBreak: settingsServer.longBreak,
          focusMusic: settingsServer.backsound,
          alarm: settingsServer.alarm,
        });
      }

      setTimerDuration({
        focusTime: parseInt(settingsServer.pomodoro),
        shortBreak: parseInt(settingsServer.short),
        longBreak: parseInt(settingsServer.long),
      });

      setFocusMusic(settingsServer.backsound);
      setAlarm(settingsServer.alarm);
    } catch {
      return;
    }
  }, [
    addSettingIDB,
    authUsername,
    deleteSettingSyncUpdate,
    editSettingIDB,
    getSettingIDB,
    getSettingSyncUpdate,
  ]);

  const fetchSettings = useCallback(async () => {
    const settings = await getAllSettingsIDB();
    const settingsLocal = settings.find(
      (setting) => setting.username === authUsername
    );

    if (!settingsLocal) {
      setTimerDuration({
        focusTime: 25,
        shortBreak: 5,
        longBreak: 10,
      });
      setFocusMusic("none");
      setAlarm("none");
    } else {
      setTimerDuration({
        focusTime: parseInt(settingsLocal.focusTime),
        shortBreak: parseInt(settingsLocal.shortBreak),
        longBreak: parseInt(settingsLocal.longBreak),
      });

      setFocusMusic(settingsLocal.focusMusic);
      setAlarm(settingsLocal.alarm);
    }
  }, [authUsername, getAllSettingsIDB]);

  const editSettings = useCallback(
    async (settings) => {
      if (!authUsername) return;

      const newLocalData = {
        username: authUsername,
        focusTime: settings.pomodoro,
        shortBreak: settings.short,
        longBreak: settings.long,
        focusMusic: settings.backsound,
        alarm: settings.alarm,
      };

      try {
        await editSettingsServer(authUsername, settings);
      } catch (error) {
        if (navigator.onLine) {
          Toast({
            title: "Error updating setting",
            description: error.message,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top-right",
          });
          return;
        } else {
          const syncData = await getSettingSyncUpdate(authUsername);
          if (syncData) await editSettingSyncUpdate(newLocalData);
          else await addSettingSyncUpdate(newLocalData);
        }
      }

      await editSettingIDB(newLocalData);

      syncSettings();
    },
    [
      addSettingSyncUpdate,
      authUsername,
      editSettingIDB,
      editSettingSyncUpdate,
      getSettingSyncUpdate,
      syncSettings,
    ]
  );

  const updateSettings = useCallback(
    (newDuration, newFocusMusic, newAlarm) => {
      setTimerDuration(newDuration);
      setFocusMusic(newFocusMusic);
      setAlarm(newAlarm);
      editSettings({
        pomodoro: newDuration["focusTime"].toString(),
        short: newDuration["shortBreak"].toString(),
        long: newDuration["longBreak"].toString(),
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
        pomodoro: timerDuration["focusTime"].toString(),
        short: timerDuration["shortBreak"].toString(),
        long: timerDuration["longBreak"].toString(),
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
        pomodoro: timerDuration["focusTime"].toString(),
        short: timerDuration["shortBreak"].toString(),
        long: timerDuration["longBreak"].toString(),
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
          pomodoro: timerDuration["focusTime"].toString(),
          short: timerDuration["shortBreak"].toString(),
          long: timerDuration["longBreak"].toString(),
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
