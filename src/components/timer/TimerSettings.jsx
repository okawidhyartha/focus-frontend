import { Button, Grid, GridItem } from "@chakra-ui/react";
import { IconAlarm, IconMusic } from "@tabler/icons-react";

export default function TimerSettings() {
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
        >
          Focus music: None
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
