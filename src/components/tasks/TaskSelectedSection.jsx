import { Center, Text } from "@chakra-ui/react";
import { useTasks } from "../../hooks/useTasks";

export default function TaskSelectedSection() {
  const { selectedTask } = useTasks();
  return (
    <Center color="white" flexDirection={"column"} width={"full"}>
      <Text fontWeight={"bold"} fontSize={{ base: "14px", md: "16px" }}>
        Doing now:
      </Text>
      <Text fontSize={{ base: "24px", md: "30px" }} fontWeight={"bold"}>
        {selectedTask?.description ?? (
          <Text as={"i"} color={"rgba(255,255,255,0.5)"}>
            Please select any task
          </Text>
        )}
      </Text>
    </Center>
  );
}
