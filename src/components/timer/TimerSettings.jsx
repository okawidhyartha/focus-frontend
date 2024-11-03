import { Button, Grid, GridItem } from "@chakra-ui/react";
import { IconAlarm, IconMusic } from "@tabler/icons-react";
import { useTimer } from "../../hooks/useTimer";
import { FOCUS_MUSICS } from "../../helpers/constants";

export default function TimerSettings() {
  const { focusMusic, setIsVisibleFocusMusicSetting } = useTimer();

  const musicName = FOCUS_MUSICS.find(
    (music) => music.value === focusMusic
  ).name;

  return (
    <Grid templateColumns="repeat(2, 1fr)" width="100%" gap="20px" p="30px">
      <GridItem>
        <Button
          backgroundColor="white"
          py="8px"
          px="15px"
          borderRadius="8px"
          width="100%"
          leftIcon={<IconMusic />}
          onClick={() => setIsVisibleFocusMusicSetting((prev) => !prev)}
        >
          Focus music: {musicName}
        </Button>
      </GridItem>
      <GridItem>
        <Button
          backgroundColor="white"
          py="8px"
          px="15px"
          borderRadius="8px"
          width="100%"
          leftIcon={<IconAlarm />}
        >
          Alarm: None
        </Button>
      </GridItem>
    </Grid>
  );
}
