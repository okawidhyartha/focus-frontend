export const API_URL = "https://capstone-pomodoro.duckdns.org";

export const AUTH_USERNAME_KEY = "authUsername";

export const GUEST_USERNAME = "___GUEST___";

export const TIMER_OPTIONS = [
  {
    value: "focusTime",
    name: "Focus Time",
    // minutes: 25,
    minutes: 0.1,
    color: "#E9BE61",
  },
  {
    value: "shortBreak",
    name: "Short Break",
    // minutes: 5,
    minutes: 0.1,
    color: "#70BACA",
  },
  {
    value: "longBreak",
    name: "Long Break",
    // minutes: 15,
    minutes: 0.1,
    color: "#CA8270",
  },
];

export const TIMER_ORDER = [
  "focusTime",
  "shortBreak",
  "focusTime",
  "shortBreak",
  "focusTime",
  "shortBreak",
  "focusTime",
  "longBreak",
];

export const FOCUS_MUSICS = [
  {
    name: "None",
    value: "none",
    audio: null,
    background: null,
  },
  {
    name: "Rain",
    value: "rain",
    audio: "/audios/rain-143417.mp3",
    background: "/images/rain-background.webp",
  },
  {
    name: "Thinking Piano",
    value: "thinking-piano",
    audio: "/audios/thinking-piano-music-ambience-225272.mp3",
    background: "/images/piano-background.webp",
  },
  {
    name: "Lo-fi Focus",
    value: "lo-fi-focus",
    audio: "/audios/satisfying-lofi-for-focus-study-amp-working-242103.mp3",
    background: "/images/lofi-background.webp",
  },
  {
    name: "Afternoon Coffee",
    value: "afternoon-coffee",
    audio: "/audios/afternoon-coffee-139847.mp3",
    background: "/images/afternoon-coffee-background.webp",
  },
];

export const ALARMS = [
  {
    name: "None",
    value: "none",
    audio: null,
    background: null,
  },
  {
    name: "Counter Bell",
    value: "counter-bell",
    audio: "/audios/alarm-bell-hand.wav",
    background: "/images/counter-bell-background.webp",
  },
];
