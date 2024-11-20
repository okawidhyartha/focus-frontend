import { Box, Heading, VStack } from "@chakra-ui/react";
import TaskInput from "./TaskInput";
import { useTasks } from "../../hooks/useTasks";
import TaskCard from "./TaskCard";

export default function TasksSection() {
  const { tasks } = useTasks();
  return (
    <VStack align="flex-start" width={"full"}>
      <Heading
        as={"h2"}
        color={"white"}
        fontSize={{ base: "24px", md: "32px" }}
      >
        Tasks
      </Heading>
      <Box height="1px" width="100%" backgroundColor="gray.200" />
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      <TaskInput />
    </VStack>
  );
}
