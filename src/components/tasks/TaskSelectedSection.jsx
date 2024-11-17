import { Center, Text } from "@chakra-ui/react";
import { useTasks } from "../../hooks/useTasks";

export default function TaskSelectedSection() {
  const { selectedTask } = useTasks();
  return (
    <Center color="white" flexDirection={"column"}>
      <Text fontWeight={"bold"}>Doing now:</Text>
      <Text fontSize={30} fontWeight={"bold"}>
        {selectedTask?.description ?? (
          <Text as={"i"} color={"rgba(255,255,255,0.5)"}>
            Please select any task
          </Text>
        )}
      </Text>
    </Center>
  );
}
