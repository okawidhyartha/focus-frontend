import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { GUEST_USERNAME } from "../helpers/constants";
import { useAuth } from "../hooks/useAuth";
import { useIndexedDB } from "react-indexed-db-hook";
import { useToast } from "@chakra-ui/react";
import {
  getTasks as fetchTasksServer,
  editTask as editTaskServer,
  deleteTask as deleteTaskServer,
  addTask as addTaskServer,
} from "../apis/tasks";

export const TasksContext = createContext(null);

const isIdLocal = (id) => String(id).startsWith("GO-");

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

  const [tasks, setTasks] = useState([]);
  const [_selectedTask, setSelectedTask] = useState();
  const { authUsername, afterSignUp } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const syncRef = useRef(null);

  const syncTasks = useCallback(
    async (username) => {
      if (syncRef.current) return;
      if (!username) return;

      syncRef.current = true;

      toastSyncRef.current = toast({
        title: "Syncing tasks...",
        status: "loading",
        isClosable: false,
        position: "top-right",
      });

      try {
        const localTasks = (await getAllTasksIDB()).filter(
          (task) => task.username === username
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
              username: username,
              task_name: task.description,
              target_cycle: task.estCycle,
              actual_cycle: task.actCycle,
              complete_status: task.done,
            });
            await editTaskIDB({
              ...task,
              username: username,
              synced: true,
            });
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
              username: username,
              task_name: task.description,
              target_cycle: task.estCycle,
              actual_cycle: task.actCycle,
              timestamp: task.createdAt,
            });

            await deleteTaskIDB(task.id);

            await addTaskIDB({
              id: respData.task_id,
              username: username,
              description: task.description,
              estCycle: task.estCycle,
              actCycle: task.actCycle,
              done: task.done,
              synced: true,
              createdAt: respData.createdAt,
            });
          } catch {
            throw new Error(
              "Error syncing tasks: some tasks could not be added"
            );
          }
        }

        try {
          const tasksServer = await fetchTasksServer(username);

          for (const task of tasksServer) {
            await editTaskIDB({
              id: task.id,
              username: username,
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

      syncRef.current = false;

      toast.close(toastSyncRef.current);
    },
    [addTaskIDB, deleteTaskIDB, editTaskIDB, getAllTasksIDB, toast]
  );

  const fetchTasks = useCallback(
    async (username) => {
      if (!username) return;
      const localTasks = (await getAllTasksIDB()).filter(
        (task) => task.username === username && task.localDeleted === false
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

      if (username !== GUEST_USERNAME && navigator.onLine) syncTasks(username);
    },
    [getAllTasksIDB, syncTasks]
  );

  const syncAfterSignUp = useCallback(
    async (username) => {
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
          task.username = username;
          const resp = await addTaskServer({
            username: username,
            task_name: task.description,
            target_cycle: task.estCycle,
            actual_cycle: task.actCycle,
            timestamp: task.createdAt,
          });

          await deleteTaskIDB(task.id);

          await addTaskIDB({ ...task, id: resp.task_id, synced: true });
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

      toast.close(toastSyncRef.current);
    },
    [addTaskIDB, deleteTaskIDB, getAllTasksIDB, toast]
  );

  useEffect(() => {
    if (afterSignUp.current) {
      syncAfterSignUp(authUsername);
      afterSignUp.current = false;
    } else fetchTasks(authUsername ?? GUEST_USERNAME);
  }, [afterSignUp, authUsername, fetchTasks, syncAfterSignUp]);

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
      else {
        if (isIdLocal(id)) await deleteTaskIDB(id);
        else await editTaskIDB({ ...data, localDeleted: true });
      }

      setTasks((prev) =>
        prev
          .filter((task) => task.id !== id)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      );
      setSelectedTask((prev) => (prev === id ? null : prev));

      setDeleting(false);
    },
    [authUsername, deleteTaskIDB, editTaskIDB, getTaskIDB]
  );

  const selecTask = useCallback((id) => {
    setSelectedTask(id);
  }, []);

  const toggleDone = useCallback(
    async (task) => {
      console.log("task", task);
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

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === _selectedTask),
    [tasks, _selectedTask]
  );

  const increaseActCycle = useCallback(async () => {
    if (!selectedTask) return;
    const newSelectedTask = {
      ...selectedTask,
      actCycle: selectedTask.actCycle + 1,
    };
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
    if (authUsername && navigator.onLine) syncTasks(authUsername);
  }, [authUsername, syncTasks]);

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
