import { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Box } from "@chakra-ui/react";
import { useTimer } from "../../hooks/useTimer";
import { FOCUS_MUSICS } from "../../helpers/constants";
import { useSettings } from "../../hooks/useSettings";

export default function TimerAudio() {
  const { playing: playingTImer } = useTimer();
  const { focusMusic } = useSettings();
  const [playingOne, setPlayingOne] = useState(false);
  const [playingTwo, setPlayingTwo] = useState(false);
  const [volumeOne, setVolumeOne] = useState(1);
  const [volumeTwo, setVolumeTwo] = useState(1);
  const [playerOne, setPlayerOne] = useState(null);
  const [playerTwo, setPlayerTwo] = useState(null);
  const [playerActive, setPlayerActive] = useState(1);

  const musicFile = FOCUS_MUSICS.find(
    (music) => music.value === focusMusic
  ).audio;

  // Fade function to gradually adjust volume
  const fadeVolume = useCallback(
    (setVolume, startVolume, endVolume, duration) => {
      const stepTime = 20; // in ms
      const stepCount = duration / stepTime;
      const volumeStep = (endVolume - startVolume) / stepCount;
      let currentVolume = startVolume;
      let steps = 0;

      function step() {
        currentVolume += volumeStep;
        setVolume(currentVolume);
        steps++;

        if (steps < stepCount) {
          requestAnimationFrame(step);
        } else {
          setVolume(endVolume); // Ensure final volume is exactly endVolume
        }
      }

      requestAnimationFrame(step);
    },
    []
  );

  // Generalized progress handler
  const handleProgress = useCallback(
    (
      state,
      player,
      setVolume,
      playingOther,
      setPlayingOther,
      setVolumeOther
    ) => {
      const { playedSeconds, loadedSeconds } = state;
      const durationLeftMs = (loadedSeconds - playedSeconds) * 1000;

      if (durationLeftMs <= 2000 && player && !playingOther) {
        fadeVolume(setVolume, 1, 0, durationLeftMs);
        fadeVolume(setVolumeOther, 0.5, 1, durationLeftMs);
        setPlayingOther(true);
        setPlayerActive((prev) => (prev === 1 ? 2 : 1));
      }
    },
    [fadeVolume]
  );

  const handleReady = useCallback((player, setPlayer) => {
    setPlayer(player);
  }, []);

  const handlePlay = useCallback(() => {
    if (playerActive === 1) {
      fadeVolume(setVolumeOne, 0, 1, 1000);
      setPlayingOne(true);
    } else {
      fadeVolume(setVolumeTwo, 0, 1, 1000);
      setPlayingTwo(true);
    }
  }, [playerActive, fadeVolume, setVolumeOne, setVolumeTwo]);

  const handlePause = useCallback(() => {
    if (playerActive === 1) {
      setPlayingOne(false);
    } else {
      setPlayingTwo(false);
    }
  }, [playerActive]);

  useEffect(() => {
    if (playingTImer) {
      handlePlay();
    } else {
      handlePause();
    }
  }, [playingTImer, handlePlay, handlePause]);

  return (
    <Box display="none">
      <ReactPlayer
        url={musicFile}
        playing={playingOne}
        playsinline
        onReady={(player) => handleReady(player, setPlayerOne)}
        onProgress={(state) =>
          handleProgress(
            state,
            playerOne,
            setVolumeOne,
            playingTwo,
            setPlayingTwo,
            setVolumeTwo
          )
        }
        progressInterval={500}
        onEnded={() => {
          if (playerOne) {
            setPlayingOne(false);
            playerOne.seekTo(0);
          }
        }}
        volume={volumeOne}
      />
      <ReactPlayer
        url={musicFile}
        playing={playingTwo}
        playsinline
        onReady={(player) => handleReady(player, setPlayerTwo)}
        onProgress={(state) =>
          handleProgress(
            state,
            playerTwo,
            setVolumeTwo,
            playingOne,
            setPlayingOne,
            setVolumeOne
          )
        }
        progressInterval={500}
        onEnded={() => {
          if (playerTwo) {
            setPlayingTwo(false);
            playerTwo.seekTo(0);
          }
        }}
        volume={volumeTwo}
      />
    </Box>
  );
}
