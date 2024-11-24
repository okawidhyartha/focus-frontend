import { createContext, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { API_URL, GUEST_USERNAME } from "../helpers/constants";
import { useAuth } from "../hooks/useAuth";
import { useIndexedDB } from "react-indexed-db-hook";
import { useToast } from "@chakra-ui/react";

export const TasksContext = createContext(null);

const checkIsIdLocal = (id) => String(id).startsWith("GO-");

const editTaskServer = async (id, task) => {
  const resp = await fetch(API_URL + "/task/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!resp.ok)
    throw new Error(
      "Something went wrong when updating your task. Please try again."
    );
};

const deleteTaskServer = async (id) => {
  const resp = await fetch(API_URL + "/task/" + id, {
    method: "DELETE",
  });

  if (!resp.ok)
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

export default function TasksProvider({ children }) {
  const toast = useToast();
  const toastSyncRef = useRef();

  const {
    getAll: getAllTasksIDB,
    add: addTaskIDB,
    update: editTaskIDB,
    deleteRecord: deleteTaskIDB,
    clear: clearTasksIDB,
  } = useIndexedDB("tasks");
  const [syncing, setSyncing] = useState(false);

  const {
    getAll: getAllTasksSyncUpdate,
    deleteRecord: deleteTaskSyncUpdate,
    getByID: getTaskSyncUpdate,
    update: editTaskSyncUpdate,
    add: addTaskSyncUpdate,
  } = useIndexedDB("tasksSyncUpdate");

  const {
    getAll: getAllTasksSyncDelete,
    deleteRecord: deleteTaskSyncDelete,
    getByID: getTaskSyncDelete,
    add: addTaskSyncDelete,
  } = useIndexedDB("tasksSyncDelete");

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState();
  const { authUsername } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);

  const editTaskSync = useCallback(
    async (id, task) => {
      await editTaskServer(id, task);
      await deleteTaskSyncUpdate(id);
    },
    [deleteTaskSyncUpdate]
  );

  const deleteTaskSync = useCallback(
    async (id) => {
      await deleteTaskServer(id);
      await deleteTaskSyncDelete(id);
    },
    [deleteTaskSyncDelete]
  );

  const addTasksIDB = useCallback(
    async (tasks) => {
      for (const task of tasks) {
        await addTaskIDB(task);
      }
    },
    [addTaskIDB]
  );

  const updateTasksIDB = useCallback(
    async (tasks) => {
      for (const task of tasks) {
        await editTaskIDB(task);
      }
    },
    [editTaskIDB]
  );

  const deleteTasksIDB = useCallback(
    async (ids) => {
      for (const id of ids) {
        await deleteTaskIDB(id);
      }
    },
    [deleteTaskIDB]
  );

  const syncTasks = useCallback(async () => {
    if (
      !navigator.onLine ||
      !authUsername ||
      syncing ||
      updating ||
      deleting ||
      adding
    )
      return;

    setSyncing(true);
    toastSyncRef.current = toast({
      title: "Syncing tasks...",
      status: "loading",
      isClosable: false,
      position: "top-right",
    });

    const tasksSyncUpdate = await getAllTasksSyncUpdate();
    const promisesUpdate = tasksSyncUpdate.map((task) =>
      editTaskSync(task.id, {
        username: authUsername,
        task_name: task.description,
        target_cycle: task.estCycle,
        actual_cycle: task.actCycle,
        complete_status: task.done,
      })
    );
    const resultsUpdate = await Promise.allSettled(promisesUpdate);
    const isAnyUpdateRejected = resultsUpdate.some((result) => {
      if (result.status === "rejected") {
        return true;
      }
    });
    if (isAnyUpdateRejected) {
      toast({
        title: "Error syncing tasks: some tasks could not be updated",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const tasksSyncDelete = await getAllTasksSyncDelete();
    const promisesDelete = tasksSyncDelete.map((task) =>
      deleteTaskSync(task.id)
    );
    const resultsDelete = await Promise.allSettled(promisesDelete);
    const isAnyDeleteRejected = resultsDelete.some((result) => {
      if (result.status === "rejected") {
        return true;
      }
    });
    if (isAnyDeleteRejected) {
      toast({
        title: "Error syncing tasks: some tasks could not be deleted",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const fetchServer = fetch(API_URL + "/tasks/" + authUsername);
    const fetchLocal = getAllTasksIDB();
    const [respServer, tasksLocal] = await Promise.all([
      fetchServer,
      fetchLocal,
    ]);

    if (!respServer.ok) {
      toast({
        title: "Error syncing tasks: could not fetch tasks from server",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    const { data: tasksServer } = await respServer.json();

    const taskLocalNotInServer = tasksLocal.filter(
      (task) =>
        checkIsIdLocal(task.id) && !tasksServer.some((t) => t.id === task.id)
    );

    const taskToDeleteOnLocal = tasksLocal.filter(
      (task) =>
        !checkIsIdLocal(task.id) && !tasksServer.some((t) => t.id === task.id)
    );

    const taskToUpdateOnLocal = tasksServer.filter((task) =>
      tasksLocal.some((t) => t.id === task.id)
    );

    const promisesAdd = taskLocalNotInServer.map((task) =>
      addTaskServer({
        username: authUsername,
        task_name: task.description,
        target_cycle: task.estCycle,
      })
    );

    const resultsAdd = await Promise.allSettled(promisesAdd);
    const isAnyAddRejected = resultsAdd.some((result) => {
      if (result.status === "rejected") {
        return true;
      }
    });
    if (isAnyAddRejected) {
      toast({
        title: "Error syncing tasks: some tasks could not be added",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    for (let index = 0; index < resultsAdd.length; index++) {
      const resultAdd = resultsAdd[index];
      if (resultAdd.status === "fulfilled") {
        const { task_id } = resultAdd.value;
        const task = taskLocalNotInServer[index];
        await deleteTaskIDB(task.id);
        await addTaskIDB({
          id: task_id,
          username: authUsername,
          description: task.description,
          estCycle: task.estCycle,
          actCycle: task.actCycle,
          done: task.done,
        });
      }
    }

    const taskServerNotInLocal = tasksServer.filter(
      (task) => !tasksLocal.some((t) => t.id === task.id)
    );

    const taskServerNotInLocalFormated = taskServerNotInLocal.map((task) => ({
      id: task.id,
      description: task.task_name,
      estCycle: task.target_cycle,
      actCycle: task.actual_cycle,
      done: task.complete_status,
      username: authUsername,
    }));

    await addTasksIDB(taskServerNotInLocalFormated);
    await deleteTasksIDB(taskToDeleteOnLocal.map((task) => task.id));
    await updateTasksIDB(
      taskToUpdateOnLocal.map((task) => ({
        id: task.id,
        description: task.task_name,
        estCycle: task.target_cycle,
        actCycle: task.actual_cycle,
        done: task.complete_status,
        username: authUsername,
      }))
    );

    const allTasksSynced = await getAllTasksIDB();

    setTasks(allTasksSynced);

    setSyncing(false);
    toast.close(toastSyncRef.current);
  }, [
    addTaskIDB,
    addTasksIDB,
    adding,
    authUsername,
    deleteTaskIDB,
    deleteTaskSync,
    deleteTasksIDB,
    deleting,
    editTaskSync,
    getAllTasksIDB,
    getAllTasksSyncDelete,
    getAllTasksSyncUpdate,
    syncing,
    toast,
    updateTasksIDB,
    updating,
  ]);

  const syncInitialTasks = useCallback(
    async (tasks) => {
      const newTasks = tasks.filter((task) => task.username === GUEST_USERNAME);

      for (const task of newTasks) {
        /* 
        Create a new task in the server and update the task with the new id
        */
        const { task_id } = await addTaskServer({
          username: authUsername,
          task_name: task.description,
          target_cycle: task.estCycle,
        });

        await deleteTaskIDB(task.id);

        await addTaskIDB({
          id: task_id,
          username: authUsername,
          description: task.description,
          estCycle: task.estCycle,
          actCycle: task.actCycle,
          done: task.done,
        });

        const respEdit = await fetch(API_URL + "/task/" + task_id, {
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

        if (!respEdit.ok) {
          // TODO: create sync queue to retry later
        }
      }
    },
    [addTaskIDB, authUsername, deleteTaskIDB]
  );

  const initialFetchTasks = useCallback(async () => {
    if (!authUsername) return;
    const resp = await fetch(API_URL + "/tasks/" + authUsername);
    const tasksIDB = await getAllTasksIDB();

    if (!resp.ok) {
      if (resp.status === 404) {
        /* 
        if users is new, sync the guest tasks with the server
        */
        const guestTasks = tasksIDB.filter(
          (task) => task.username === GUEST_USERNAME
        );
        setTasks(guestTasks);
        syncInitialTasks(guestTasks);
      } else {
        // TODO: show error message
        return;
      }
    } else {
      /* 
      if user is already registered, fetch the tasks from the server
      and remove all taks from indexedDB
      */
      const json = await resp.json();

      const formatedTasks = json.data
        .map((task) => ({
          id: task.id,
          description: task.task_name,
          estCycle: task.target_cycle,
          actCycle: task.actual_cycle,
          done: task.complete_status,
          username: authUsername,
        }))
        .sort((a, b) => a.id - b.id);

      setTasks(formatedTasks);
      clearTasksIDB();
      addTasksIDB(formatedTasks);
    }
  }, [
    addTasksIDB,
    authUsername,
    clearTasksIDB,
    getAllTasksIDB,
    syncInitialTasks,
  ]);

  useEffect(() => {
    initialFetchTasks();
  }, [initialFetchTasks]);

  const addTask = useCallback(
    async (task) => {
      setAdding(true);
      let taskId = `GO-${new Date().getTime()}-${Math.floor(
        Math.random() * 1000
      )}`;

      if (authUsername) {
        const data = {
          username: authUsername,
          task_name: task.description,
          target_cycle: task.estCycle,
        };

        try {
          const { task_id } = await addTaskServer(data);
          taskId = task_id;
        } catch (error) {
          if (navigator.onLine) {
            toast({
              title: "Error adding task",
              description: error.message,
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top-right",
            });
            setAdding(false);
            return;
          }
        }
      }

      const taskIDB = {
        id: taskId,
        username: authUsername ?? GUEST_USERNAME,
        ...task,
      };

      await addTaskIDB(taskIDB);

      setTasks((prev) => [...prev, { id: taskId, ...task }]);

      setAdding(false);
      syncTasks();
    },
    [addTaskIDB, authUsername, syncTasks, toast]
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
      setUpdating(true);
      if (authUsername && !checkIsIdLocal(task.id)) {
        const data = {
          username: authUsername,
          task_name: task.description,
          target_cycle: task.estCycle,
          actual_cycle: task.actCycle,
          complete_status: task.done,
        };

        try {
          await editTaskServer(task.id, data);
          await deleteTaskSyncUpdate(task.id);
        } catch (error) {
          if (navigator.onLine) {
            toast({
              title: "Error updating task",
              description: error.message,
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top-right",
            });
            setUpdating(false);
            return;
          } else {
            const syncData = await getTaskSyncUpdate(task.id);
            if (syncData) await editTaskSyncUpdate(task);
            else await addTaskSyncUpdate(task);
          }
        }
      }

      await editTaskIDB({ ...task, username: authUsername ?? GUEST_USERNAME });

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === task.id) {
            return task;
          }
          return t;
        })
      );
      setUpdating(false);
      syncTasks();
    },
    [
      addTaskSyncUpdate,
      authUsername,
      deleteTaskSyncUpdate,
      editTaskIDB,
      editTaskSyncUpdate,
      getTaskSyncUpdate,
      syncTasks,
      toast,
    ]
  );

  const toggleDone = useCallback(
    async (task) => {
      editTask({ ...task, done: !task.done });
    },
    [editTask]
  );

  const deleteTask = useCallback(
    async (id) => {
      setDeleting(true);
      if (authUsername && !checkIsIdLocal(id)) {
        try {
          await deleteTaskServer(id);
        } catch (error) {
          if (navigator.onLine) {
            toast({
              title: "Error deleting task",
              description: error.message,
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top-right",
            });
            setDeleting(false);
            return;
          } else {
            const syncData = await getTaskSyncDelete(id);
            if (syncData) return;
            await addTaskSyncDelete({
              id,
              username: authUsername,
            });
          }
        }
      }

      await deleteTaskIDB(id);
      await deleteTaskSyncUpdate(id);

      setTasks((prev) => prev.filter((task) => task.id !== id));
      setSelectedTask((prev) => (prev?.id === id ? null : prev));

      setDeleting(false);
      syncTasks();
    },
    [
      addTaskSyncDelete,
      authUsername,
      deleteTaskIDB,
      deleteTaskSyncUpdate,
      getTaskSyncDelete,
      syncTasks,
      toast,
    ]
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

  useEffect(() => {
    window.addEventListener("online", syncTasks);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("focus", syncTasks);
    return () => {
      window.removeEventListener("online", syncTasks);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("focus", syncTasks);
    };
  }, [handleOffline, syncTasks]);

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
