import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useState } from "react";
import { useTasks } from "../../hooks/useTasks";
import PropTypes from "prop-types";

export default function TaskEdit({ task, onCancel }) {
  const [focusCycle, setFocusCycle] = useState(task.estCycle);
  const [description, setDescription] = useState(task.description);
  const { editTask, deleteTask } = useTasks();

  const handleUp = () => {
    setFocusCycle((prev) => prev + 1);
  };

  const handleDown = () => {
    setFocusCycle((prev) => prev - 1);
  };

  const handleSave = () => {
    editTask({
      ...task,
      description,
      estCycle: focusCycle,
    });
    onCancel();
  };

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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <VStack align={"flex-start"} width={"100%"}>
          <Text color={"#7D7D7D"} fontSize={{ base: "14px", md: "16px" }}>
            act / est focus cycle time
          </Text>
          <HStack>
            <NumberInput
              value={task.actCycle}
              width={{ base: "40px", md: "60px" }}
            >
              <NumberInputField
                textAlign={"center"}
                padding={0}
                color={"#7D7D7D"}
                disabled
                fontSize={{ base: "14px", md: "16px" }}
              />
            </NumberInput>
            <Text>/</Text>
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
              icon={<IconChevronDown />}
              onClick={handleDown}
              disabled={focusCycle === 1}
              color={"#7D7D7D"}
            />

            <IconButton
              icon={<IconChevronUp />}
              onClick={handleUp}
              color={"#7D7D7D"}
            />
          </HStack>
        </VStack>
      </VStack>
      <HStack
        backgroundColor={"rgba(0, 0, 0, 0.2)"}
        padding={{ base: "16px 16px 16px 16px", md: "26px 49px 19px 49px" }}
        justify={"space-between"}
      >
        <Button
          variant="ghost"
          color={"#645B5B"}
          fontSize={{ base: "14px", md: "16px" }}
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </Button>
        <HStack>
          <Button
            variant="ghost"
            color={"#645B5B"}
            fontSize={{ base: "14px", md: "16px" }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            disabled={!task}
            backgroundColor={"#645B5B"}
            color={"white"}
            _hover={{
              backgroundColor: "#574f4f",
            }}
            fontSize={{ base: "14px", md: "16px" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}

TaskEdit.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired,
    estCycle: PropTypes.number.isRequired,
    actCycle: PropTypes.number.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};
