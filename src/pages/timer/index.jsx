import { Box, Grid, GridItem } from "@chakra-ui/react";
import HeaderNav from "../../components/HeaderNav";
import { useTimer } from "../../hooks/useTimer";
import TimerSection from "../../components/timer/TimerSection";

export default function TimerPage() {
  const { color } = useTimer();
  return (
    <Box backgroundColor={color} width="100%" height="100vh" transition="ease-in 0.3s" px="77px" py="50px">
      <HeaderNav />
      <Grid templateColumns="repeat(2, 1fr)" mt="62px">
        <GridItem width="100%">
          <TimerSection />
        </GridItem>
        <GridItem width="100%"></GridItem>
      </Grid>
    </Box>
  );
}
