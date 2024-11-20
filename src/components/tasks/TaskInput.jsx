import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  IconChevronDown,
  IconChevronUp,
  IconCirclePlus,
} from "@tabler/icons-react";
import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";

const AddTaskButton = (props) => {
  return (
    <Button
      backgroundColor={"rgba(0, 0, 0, 0.2)"}
      width={"100%"}
      height={"100%"}
      color={"white"}
      py={{ base: "15px", md: "20px" }}
      _hover={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
      }}
      {...props}
    >
      <IconCirclePlus />
      <Text ml={2} fontSize={{ base: "14px", md: "16px" }}>
        Add Task
      </Text>
    </Button>
  );
};

export default function TaskInput() {
  const [focusCycle, setFocusCycle] = useState(1);
  const [task, setTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const { addTask } = useTasks();

  const handleUp = () => {
    setFocusCycle((prev) => prev + 1);
  };

  const handleDown = () => {
    setFocusCycle((prev) => prev - 1);
  };

  const handleSave = () => {
    const id = `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
    addTask({
      id,
      description: task,
      estCycle: focusCycle,
      actCycle: 0,
      done: false,
    });
    setTask("");
    setFocusCycle(1);
  };

  if (!showInput) return <AddTaskButton onClick={() => setShowInput(true)} />;

  return (
    <Box
      backgroundColor={"rgba(255, 255, 255, 0.8)"}
      borderRadius={"10px"}
      width={"100%"}
      overflow={"hidden"}
    >
      <VStack
        px={{ base: "20px", md: "48px" }}
        width={"100%"}
        align={"flex-start"}
        spacing={0}
        py={{ base: "14px", md: "20px" }}
      >
        <Input
          placeholder="What are you working on?"
          width={"100%"}
          variant={"transparent"}
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <Stack
          justify={"space-between"}
          width={"100%"}
          direction={{ base: "column", md: "row" }}
        >
          <Text color={"#7D7D7D"} fontSize={{ base: "14px", md: "16px" }}>
            est focus cycle time
          </Text>
          <HStack>
            <IconButton
              icon={<IconChevronDown />}
              onClick={handleDown}
              disabled={focusCycle === 1}
              color={"#7D7D7D"}
            />
            <NumberInput
              value={focusCycle}
              min={1}
              width={{ base: "40px", md: "60px" }}
            >
              <NumberInputField
                textAlign={"center"}
                padding={0}
                color={"#7D7D7D"}
                fontSize={{ base: "14px", md: "16px" }}
              />
            </NumberInput>
            <IconButton
              icon={<IconChevronUp />}
              onClick={handleUp}
              color={"#7D7D7D"}
            />
          </HStack>
        </Stack>
      </VStack>
      <HStack
        backgroundColor={"rgba(0, 0, 0, 0.2)"}
        padding={{ base: "16px 16px 16px 16px", md: "26px 49px 19px 49px" }}
        justify={"flex-end"}
      >
        <Button
          variant="ghost"
          color={"#645B5B"}
          fontSize={{ base: "14px", md: "16px" }}
          onClick={() => setShowInput(false)}
        >
          Cancel
        </Button>
        <Button
          disabled={!task}
          backgroundColor={"#645B5B"}
          color={"white"}
          fontSize={{ base: "14px", md: "16px" }}
          _hover={{
            backgroundColor: "#574f4f",
          }}
          onClick={handleSave}
        >
          Save
        </Button>
      </HStack>
    </Box>
  );
}
