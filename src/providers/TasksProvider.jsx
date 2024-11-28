import { createContext, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { API_URL, GUEST_USERNAME } from "../helpers/constants";
import { useAuth } from "../hooks/useAuth";
import { useIndexedDB } from "react-indexed-db-hook";
import { useToast } from "@chakra-ui/react";

export const TasksContext = createContext(null);

const isIdLocal = (id) => String(id).startsWith("GO-");

const editTaskServer = async (id, task) => {
  const resp = await fetch(API_URL + "/task/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!resp.ok && resp.status !== 404)
    throw new Error(
      "Something went wrong when updating your task. Please try again."
    );
};

const deleteTaskServer = async (id) => {
  const resp = await fetch(API_URL + "/task/" + id, {
    method: "DELETE",
  });

  if (!resp.ok && resp.status !== 404)
    throw new Error(
      "Something went wrong when deleting your task. Please try again."
    );
};

const addTaskServer = async (task) => {
  const resp = await fetch(API_URL + "/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!resp.ok)
    throw new Error(
      "Something went wrong when adding your task. Please try again."
    );

  const { data } = await resp.json();

  return data;
};

const fetchTasksServer = async (username) => {
  const resp = await fetch(API_URL + "/tasks/" + username);

  if (!resp.ok) {
    if (resp.status === 404) return [];
    else
      throw new Error(
        "Something went wrong when fetching your tasks. Please try again."
      );
  }

  const { data } = await resp.json();

  return data;
};

export default function TasksProvider({ children }) {
  const toast = useToast();
  const toastSyncRef = useRef();

  const {
    getAll: getAllTasksIDB,
    add: addTaskIDB,
    update: editTaskIDB,
    deleteRecord: deleteTaskIDB,
    getByID: getTaskIDB,
  } = useIndexedDB("tasks");
  const [syncing, setSyncing] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState();
  const { authUsername } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);

  const syncTasks = useCallback(async () => {
    setSyncing(true);
    toastSyncRef.current = toast({
      title: "Syncing tasks...",
      status: "loading",
      isClosable: false,
      position: "top-right",
    });

    try {
      const localTasks = (await getAllTasksIDB()).filter(
        (task) => task.username === authUsername
      );

      const tasksToDelete = localTasks.filter(
        (task) => task.localDeleted && !isIdLocal(task.id)
      );

      for (const task of tasksToDelete) {
        try {
          await deleteTaskServer(task.id);
          await deleteTaskIDB(task.id);
        } catch {
          throw new Error(
            "Error syncing tasks: some tasks could not be deleted"
          );
        }
      }

      const tasksToUpdate = localTasks.filter(
        (task) => !task.synced && !isIdLocal(task.id)
      );

      for (const task of tasksToUpdate) {
        try {
          await editTaskServer(task.id, {
            username: authUsername,
            task_name: task.description,
            target_cycle: task.estCycle,
            actual_cycle: task.actCycle,
            complete_status: task.done,
          });
          await editTaskIDB({ ...task, username: authUsername, synced: true });
        } catch {
          throw new Error(
            "Error syncing tasks: some tasks could not be updated"
          );
        }
      }

      const tasksToAdd = localTasks.filter(
        (task) => !task.synced && isIdLocal(task.id)
      );

      for (const task of tasksToAdd) {
        try {
          const respData = await addTaskServer({
            username: authUsername,
            task_name: task.description,
            target_cycle: task.estCycle,
            actual_cycle: task.actCycle,
            timestamp: task.createdAt,
          });

          await deleteTaskIDB(task.id);

          await addTaskIDB({
            id: respData.task_id,
            username: authUsername,
            description: task.description,
            estCycle: task.estCycle,
            actCycle: task.actCycle,
            done: task.done,
            synced: true,
            createdAt: respData.createdAt,
          });
        } catch {
          throw new Error("Error syncing tasks: some tasks could not be added");
        }
      }

      try {
        const tasksServer = await fetchTasksServer(authUsername);

        for (const task of tasksServer) {
          await editTaskIDB({
            id: task.id,
            username: authUsername,
            description: task.task_name,
            estCycle: task.target_cycle,
            actCycle: task.actual_cycle,
            done: task.complete_status,
            synced: true,
            createdAt: task.timestamp,
          });
        }

        setTasks(
          tasksServer
            .map((task) => ({
              id: task.id,
              description: task.task_name,
              estCycle: task.target_cycle,
              actCycle: task.actual_cycle,
              done: task.complete_status,
              createdAt: task.timestamp,
            }))
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        );
      } catch {
        throw new Error(
          "Error syncing tasks: could not fetch tasks from server"
        );
      }
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    }

    setSyncing(false);
    toast.close(toastSyncRef.current);
  }, [
    addTaskIDB,
    authUsername,
    deleteTaskIDB,
    editTaskIDB,
    getAllTasksIDB,
    toast,
  ]);

  const fetchTasks = useCallback(async () => {
    const username = authUsername ?? GUEST_USERNAME;
    const localTasks = (await getAllTasksIDB()).filter(
      (task) => task.username === username
    );

    setTasks(
      localTasks
        .map((task) => ({
          id: task.id,
          description: task.description,
          estCycle: task.estCycle,
          actCycle: task.actCycle,
          done: task.done,
          createdAt: task.createdAt,
        }))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );

    if (authUsername && navigator.onLine) syncTasks();
  }, [authUsername, getAllTasksIDB, syncTasks]);

  const syncAfterSignUp = useCallback(async () => {
    setSyncing(true);
    toastSyncRef.current = toast({
      title: "Syncing tasks...",
      status: "loading",
      isClosable: false,
      position: "top-right",
    });

    const localGuestTasks = (await getAllTasksIDB()).filter(
      (task) => task.username === GUEST_USERNAME
    );

    for (const task of localGuestTasks) {
      try {
        task.username = authUsername;
        const resp = await addTaskServer({
          username: authUsername,
          task_name: task.description,
          target_cycle: task.estCycle,
          actual_cycle: task.actCycle,
          timestamp: task.createdAt,
        });

        await deleteTaskIDB(task.id);

        await addTaskIDB({ id: resp.task_id, ...task });
      } catch (error) {
        toast({
          title: error.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
        break;
      }
    }

    setTasks(
      localGuestTasks
        .map((task) => ({
          id: task.id,
          description: task.description,
          estCycle: task.estCycle,
          actCycle: task.actCycle,
          done: task.done,
          createdAt: task.createdAt,
        }))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    );

    setSyncing(false);
    toast.close(toastSyncRef.current);
  }, [addTaskIDB, authUsername, deleteTaskIDB, getAllTasksIDB, toast]);

  const addTask = useCallback(
    async (task) => {
      setAdding(true);
      let taskId = `GO-${new Date().getTime()}-${Math.floor(
        Math.random() * 1000
      )}`;
      const createdAt = new Date().toISOString();
      let username = authUsername ?? GUEST_USERNAME;
      let synced = false;

      if (navigator.onLine) {
        try {
          const respData = await addTaskServer({
            username,
            task_name: task.description,
            target_cycle: task.estCycle,
            actual_cycle: parseInt(task.actCycle),
            timestamp: createdAt,
          });

          const { task_id } = respData;
          taskId = task_id;
          synced = true;
        } catch {
          synced = false;
        }
      }

      await addTaskIDB({
        id: taskId,
        username,
        synced,
        localDeleted: false,
        createdAt,
        ...task,
      });

      setTasks((prev) =>
        [...prev, { id: taskId, createdAt, ...task }].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      );

      setAdding(false);
    },
    [addTaskIDB, authUsername]
  );

  const editTask = useCallback(
    async (task) => {
      setUpdating(true);
      let username = authUsername ?? GUEST_USERNAME;
      let synced = false;
      if (authUsername && navigator.onLine && !isIdLocal(task.id)) {
        try {
          await editTaskServer(task.id, {
            username,
            task_name: task.description,
            target_cycle: task.estCycle,
            actual_cycle: task.actCycle,
            complete_status: task.done,
          });
          synced = true;
        } catch {
          synced = false;
        }
      }

      await editTaskIDB({
        ...task,
        username,
        synced,
        localDeleted: false,
      });

      setTasks((prev) =>
        prev
          .map((t) => {
            if (t.id === task.id) return task;
            return t;
          })
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      );

      setUpdating(false);
    },
    [authUsername, editTaskIDB]
  );

  const deleteTask = useCallback(
    async (id) => {
      const data = await getTaskIDB(id);
      if (!data) return;
      setDeleting(true);
      let deleted = false;

      if (authUsername && navigator.onLine && !isIdLocal(id)) {
        try {
          await deleteTaskServer(id);
          deleted = true;
        } catch {
          deleted = false;
        }
      }

      if (deleted) await deleteTaskIDB(id);
      else await editTaskIDB({ ...data, localDeleted: true });

      setTasks((prev) =>
        prev
          .filter((task) => task.id !== id)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      );
      setSelectedTask((prev) => (prev?.id === id ? null : prev));

      setDeleting(false);
    },
    [authUsername, deleteTaskIDB, editTaskIDB, getTaskIDB]
  );

  const selecTask = useCallback(
    (id) => {
      const task = tasks.find((task) => task.id === id);
      setSelectedTask(task);
    },
    [tasks]
  );

  const toggleDone = useCallback(
    async (task) => {
      if (!task.done === true)
        toast({
          title: "Good job for completing your task! 🥳",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          size: "sm",
        });
      editTask({ ...task, done: !task.done });
    },
    [editTask, toast]
  );

  const increaseActCycle = useCallback(async () => {
    if (!selectedTask) return;
    const newSelectedTask = {
      ...selectedTask,
      actCycle: selectedTask.actCycle + 1,
    };
    setSelectedTask(newSelectedTask);
    await editTask(newSelectedTask);
  }, [editTask, selectedTask]);

  const handleOffline = useCallback(() => {
    toast({
      title: (
        <>
          You are seem to be offline, <br />
          but we got you covered! 😉
        </>
      ),
      status: "warning",
      duration: 3000,
      isClosable: true,
      position: "top-right",
      size: "sm",
    });
  }, [toast]);

  const handleSync = useCallback(() => {
    if (!syncing && authUsername && navigator.onLine) syncTasks();
  }, [authUsername, syncing, syncTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    window.addEventListener("online", handleSync);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener("online", handleSync);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("focus", handleSync);
    };
  }, [handleOffline, handleSync]);

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
        fetchTasks,
        syncAfterSignUp,
        adding,
        updating,
        deleting,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

TasksProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
