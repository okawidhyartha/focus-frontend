import ReactPlayer from "react-player";
import { Box } from "@chakra-ui/react";
import { useTimer } from "../../hooks/useTimer";
import { ALARMS } from "../../helpers/constants";
import { useCallback, useEffect, useState } from "react";

export default function AlarmPlayer() {
  const { alarm, playingAlarm, setPlayingAlarm } = useTimer();
  const [player, setPlayer] = useState(null);
  const [playing, setPlaying] = useState(false);

  const alarmFile = ALARMS.find((_alarm) => _alarm.value === alarm).audio;

  const handleEnded = useCallback(() => {
    if (player) player.seekTo(0);
    setPlaying(false);
  }, [player, setPlaying]);

  useEffect(() => {
    if (playingAlarm) {
      if (player) player.seekTo(0);
      setPlaying(true);
      setPlayingAlarm(false);
    }
  }, [playingAlarm, setPlayingAlarm, player]);

  return (
    <Box display="none">
      <ReactPlayer
        url={alarmFile}
        playing={playing}
        playsinline
        onReady={setPlayer}
        onEnded={handleEnded}
      />
    </Box>
  );
}
