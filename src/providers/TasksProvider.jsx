import { createContext, useCallback, useState } from "react";
import PropTypes from "prop-types";

export const TasksContext = createContext(null);

export default function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState();

  const addTask = useCallback((task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const selecTask = useCallback(
    (id) => {
      const task = tasks.find((task) => task.id === id);
      setSelectedTask(task);
    },
    [tasks]
  );

  const editTask = useCallback((task) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === task.id) {
          return task;
        }
        return t;
      })
    );
  }, []);

  const toggleDone = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return { ...task, done: !task.done };
        }
        return task;
      })
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setSelectedTask((prev) => (prev?.id === id ? null : prev));
  }, []);

  const increaseActCycle = useCallback(() => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === selectedTask.id) {
          return { ...task, actCycle: task.actCycle + 1 };
        }
        return task;
      })
    );
  }, [selectedTask]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        deleteTask,
        selectedTask,
        selecTask,
        toggleDone,
        increaseActCycle,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

TasksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
