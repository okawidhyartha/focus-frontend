import { Box, Heading, VStack } from "@chakra-ui/react";
import TaskInput from "./TaskInput";
import { useTasks } from "../../hooks/useTasks";
import TaskCard from "./TaskCard";
import { AnimatePresence } from "motion/react";

export default function TasksSection() {
  const { tasks } = useTasks();
  return (
    <VStack align="flex-start" width={"full"} position="relative" pb={6}>
      <Heading
        as={"h2"}
        color={"white"}
        fontSize={{ base: "24px", md: "32px" }}
      >
        Tasks
      </Heading>
      <Box height="1px" width="100%" backgroundColor="gray.200" />
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <Box key={task.id} width={"full"}>
            <TaskCard task={task} />
          </Box>
        ))}
      </AnimatePresence>
      <TaskInput />
    </VStack>
  );
}
