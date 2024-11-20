import { Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { IconAlarm, IconMusic } from "@tabler/icons-react";
import { ALARMS, FOCUS_MUSICS } from "../../helpers/constants";
import { useSettings } from "../../hooks/useSettings";

export default function TimerSettings() {
  const { setIsVisibleFocusMusicSetting, setIsVisibleAlarmSetting } =
    useSettings();
  const { focusMusic, alarm } = useSettings();

  const musicName = FOCUS_MUSICS.find(
    (music) => music.value === focusMusic
  ).name;

  const alarmName = ALARMS.find((_alarm) => _alarm.value === alarm).name;

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
      width="100%"
      gap={{ base: "12px", md: "20px" }}
      p={{ base: "20px", md: "30px" }}
    >
      <GridItem>
        <Button
          backgroundColor="white"
          py="8px"
          px="15px"
          borderRadius="8px"
          width="100%"
          leftIcon={<IconMusic />}
          fontSize={{ base: "14px", md: "16px" }}
          onClick={() => setIsVisibleFocusMusicSetting((prev) => !prev)}
        >
          <Text noOfLines={1}>Focus music: {musicName}</Text>
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
          fontSize={{ base: "14px", md: "16px" }}
          onClick={() => setIsVisibleAlarmSetting((prev) => !prev)}
        >
          <Text noOfLines={1}>Alarm: {alarmName}</Text>
        </Button>
      </GridItem>
    </Grid>
  );
}
