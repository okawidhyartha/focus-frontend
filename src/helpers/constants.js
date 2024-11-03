import RainMusic from "../assets/audios/rain-143417.mp3";
import RainBackground from "../assets/images/rain-background.webp";
import ThinkingPianoMusic from "../assets/audios/thinking-piano-music-ambience-225272.mp3";
import ThinkingPianoBackground from "../assets/images/piano-background.webp";
import LofiFocusMusic from "../assets/audios/satisfying-lofi-for-focus-study-amp-working-242103.mp3";
import LofiFocusBackground from "../assets/images/lofi-background.webp";

export const TIMER_OPTIONS = [
  {
    value: "focus-time",
    name: "Focus Time",
    minutes: 25,
    color: "#E9BE61",
  },
  {
    value: "short-break",
    name: "Short Break",
    minutes: 0.1,
    color: "#70BACA",
  },
  {
    value: "long-break",
    name: "Long Break",
    minutes: 15,
    color: "#CA8270",
  },
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
    audio: RainMusic,
    background: RainBackground,
  },
  {
    name: "Thinking Piano",
    value: "thinking-piano",
    audio: ThinkingPianoMusic,
    background: ThinkingPianoBackground,
  },
  {
    name: "Lo-fi Focus",
    value: "lo-fi-focus",
    audio: LofiFocusMusic,
    background: LofiFocusBackground,
  },
];
