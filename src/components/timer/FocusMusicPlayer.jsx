import ReactPlayer from "react-player";
import { Box } from "@chakra-ui/react";
import { useTimer } from "../../hooks/useTimer";
import { FOCUS_MUSICS } from "../../helpers/constants";
import { useRef, useState } from "react";

export default function FocusMusicPlayer() {
  const { focusMusic, playing, selectedOption } = useTimer();
  const [player, setPlayer] = useState(null);
  const prevSelctedOptions = useRef(selectedOption);

  const musicFile = FOCUS_MUSICS.find(
    (music) => music.value === focusMusic
  ).audio;

  if (prevSelctedOptions.current !== selectedOption && player) {
    prevSelctedOptions.current = selectedOption;
    player.seekTo(0);
  }

  return (
    <Box display="none">
      <ReactPlayer
        url={musicFile}
        playing={playing && selectedOption === "focus-time"}
        playsinline
        loop
        onReady={setPlayer}
      />
    </Box>
  );
}
