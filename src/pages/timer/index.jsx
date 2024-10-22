import { Box, Grid, GridItem } from "@chakra-ui/react";
import HeaderNav from "../../components/HeaderNav";
import TimerCount from "../../components/timer/TimerCount";
import { useVibe } from "../../hooks/useVibe";

export default function TimerPage() {
  const { color } = useVibe();
  return (
    <Box backgroundColor={color} width="100%" height="100vh" transition="ease-in 0.3s" px="77px" py="50px">
      <HeaderNav />
      <Grid templateColumns="repeat(2, 1fr)" mt="62px">
        <GridItem width="100%">
          <TimerCount />
        </GridItem>
        <GridItem width="100%"></GridItem>
      </Grid>
    </Box>
  );
}
