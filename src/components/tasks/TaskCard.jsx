import { Box, Button, Checkbox, HStack, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTasks } from "../../hooks/useTasks";
import { useState } from "react";
import TaskEdit from "./TaskEdit";

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
      backgroundColor="rgba(255, 255, 255, 0.8)"
      borderRadius="8px"
      padding="16px"
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
    >
      <HStack>
        <Checkbox checked={done} onChange={() => toggleDone(id)} />
        {done ? (
          <Text as={"s"}>{description}</Text>
        ) : (
          <Text>{description}</Text>
        )}
      </HStack>
      <HStack alignSelf={"flex-end"}>
        <Text>
          {actCycle} / {estCycle}
        </Text>
        <Button onClick={() => setShowEdit(true)}>Edit</Button>
      </HStack>
    </Box>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    estCycle: PropTypes.number.isRequired,
    actCycle: PropTypes.number.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
};
