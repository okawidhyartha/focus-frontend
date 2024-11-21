import { createContext, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { API_URL } from "../helpers/constants";
import { useAuth } from "../hooks/useAuth";

export const TasksContext = createContext(null);

export default function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState();
  const { authUsername } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!authUsername) return;
    const resp = await fetch(API_URL + "/tasks/" + authUsername);

    if (!resp.ok) setTasks([]);

    const json = await resp.json();

    setTasks(
      json.data
        .map((task) => ({
          id: task.id,
          description: task.task_name,
          estCycle: task.target_cycle,
          actCycle: task.actual_cycle,
          done: task.complete_status,
        }))
        .sort((a, b) => a.id - b.id)
    );
  }, [authUsername]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(
    async (task) => {
      const resp = await fetch(API_URL + "/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: authUsername,
          task_name: task.description,
          target_cycle: task.estCycle,
        }),
      });

      if (resp.ok) fetchTasks();
      // setTasks((prev) => [...prev, task]);
    },
    [authUsername, fetchTasks]
  );

  const selecTask = useCallback(
    (id) => {
      const task = tasks.find((task) => task.id === id);
      setSelectedTask(task);
    },
    [tasks]
  );

  const editTask = useCallback(
    async (task) => {
      const resp = await fetch(API_URL + "/task/" + task.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: authUsername,
          task_name: task.description,
          target_cycle: task.estCycle,
          actual_cycle: task.actCycle,
          complete_status: task.done,
        }),
      });

      if (resp.ok) fetchTasks();
      // setTasks((prev) =>
      //   prev.map((t) => {
      //     if (t.id === task.id) {
      //       return task;
      //     }
      //     return t;
      //   })
      // );
    },
    [authUsername, fetchTasks]
  );

  const toggleDone = useCallback(
    async (task) => {
      const resp = await fetch(API_URL + "/task/" + task.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: authUsername,
          task_name: task.description,
          target_cycle: task.estCycle,
          actual_cycle: task.actCycle,
          complete_status: !task.done,
        }),
      });

      if (resp.ok) fetchTasks();
      // setTasks((prev) =>
      //   prev.map((task) => {
      //     if (task.id === id) {
      //       return { ...task, done: !task.done };
      //     }
      //     return task;
      //   })
      // );
    },
    [authUsername, fetchTasks]
  );

  const deleteTask = useCallback(
    async (id) => {
      const resp = await fetch(API_URL + "/task/" + id, {
        method: "DELETE",
      });

      if (resp.ok) fetchTasks();
      // setTasks((prev) =>
      //   prev.map((t) => {
      //     if (t.id === task.id) {
      //       return task;
      //     }
      //     return t;
      //   })
      // );
      // setTasks((prev) => prev.filter((task) => task.id !== id));
      // setSelectedTask((prev) => (prev?.id === id ? null : prev));
    },
    [fetchTasks]
  );

  const increaseActCycle = useCallback(async () => {
    selectedTask.actCycle += 1;

    const resp = await fetch(API_URL + "/task/" + selectedTask.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: authUsername,
        task_name: selectedTask.description,
        target_cycle: selectedTask.estCycle,
        actual_cycle: selectedTask.actCycle,
        complete_status: selectedTask.done,
      }),
    });

    if (resp.ok) fetchTasks();
    // setTasks((prev) =>
    //   prev.map((task) => {
    //     if (task.id === selectedTask.id) {
    //       return { ...task, actCycle: task.actCycle + 1 };
    //     }
    //     return task;
    //   })
    // );
  }, [authUsername, fetchTasks, selectedTask]);

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
