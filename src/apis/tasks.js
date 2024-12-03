import { privateApi, handleApiError } from ".";

export const getTasks = async (username) => {
  try {
    const resp = await privateApi.get("/task/" + username);
    return resp.data?.data;
  } catch (error) {
    if (error.response?.status === 404) return [];
    handleApiError(error);
  }
};

export const addTask = async (task) => {
  try {
    const resp = await privateApi.post("/task", task);
    return resp.data?.data;
  } catch (error) {
    handleApiError(
      error,
      "Something went wrong when adding your task. Please try again."
    );
  }
};

export const editTask = async (task) => {
  try {
    const resp = await privateApi.put("/task/" + task.id, task);
    return resp.data?.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    handleApiError(
      error,
      "Something went wrong when updating your task. Please try again."
    );
  }
};

export const deleteTask = async (taskId) => {
  try {
    const resp = await privateApi.delete("/task/" + taskId);
    return resp.data?.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    handleApiError(
      error,
      "Something went wrong when deleting your task. Please try again."
    );
  }
};
