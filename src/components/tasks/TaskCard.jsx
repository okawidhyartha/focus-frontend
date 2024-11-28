import { Box, Button, Checkbox, HStack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTasks } from "../../hooks/useTasks";
import { useState } from "react";
import TaskEdit from "./TaskEdit";
import { motion } from "motion/react";

export default function TaskCard({ task }) {
  const { description, estCycle, actCycle, id, done } = task;
  const { selecTask, selectedTask, toggleDone } = useTasks();
  const [showEdit, setShowEdit] = useState(false);

  const isSelected = selectedTask?.id === id;

  if (showEdit) {
    return <TaskEdit task={task} onCancel={() => setShowEdit(false)} />;
  }

  return (
    <Box
      as={motion.div}
      layout
      exit={{ opacity: 0, scale: 0 }}
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      backgroundColor="rgba(255, 255, 255, 0.8)"
      borderRadius="8px"
      padding={{ base: "14px", md: "16px" }}
      width="100%"
      marginBottom="8px"
      onClick={() => selecTask(id)}
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      borderLeft={
        isSelected ? "4px solid rgba(0, 0, 0, 0.5)" : "4px solid transparent"
      }
      gap={4}
    >
      <HStack>
        <Checkbox
          size={"lg"}
          checked={done}
          defaultChecked={done}
          onChange={() => toggleDone(task)}
          sx={{
            ".chakra-checkbox__control": {
              border: "2px solid rgba(0, 0, 0, 0.5)",
            },
          }}
        />
        {done ? (
          <Text fontSize={{ base: "14px", md: "16px" }} as={"s"}>
            {description}
          </Text>
        ) : (
          <Text fontSize={{ base: "14px", md: "16px" }}>{description}</Text>
        )}
      </HStack>
      <HStack alignSelf={"flex-end"} flexShrink={0}>
        <Text fontSize={{ base: "14px", md: "16px" }}>
          {actCycle} / {estCycle}
        </Text>
        <Button
          fontSize={{ base: "14px", md: "16px" }}
          onClick={() => setShowEdit(true)}
        >
          Edit
        </Button>
      </HStack>
    </Box>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string.isRequired,
    estCycle: PropTypes.number.isRequired,
    actCycle: PropTypes.number.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
};
