import { privateApi, handleApiError } from ".";

export const getSettings = async (username) => {
  try {
    const resp = await privateApi.get("/setting/" + username);
    return resp.data?.data[0];
  } catch (error) {
    if (error.response?.status === 404) return null;
    handleApiError(error, "Something went wrong when fetching your settings.");
  }
};

export const addSettings = async (settings) => {
  try {
    const resp = await privateApi.post("/setting", settings);
    return resp.data?.data;
  } catch (error) {
    handleApiError(error, "Something went wrong when adding your settings.");
  }
};

export const editSettings = async (username, settings) => {
  try {
    const resp = await privateApi.put("/setting/" + username, settings);
    return resp.data?.data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    handleApiError(error, "Something went wrong when updating your settings.");
  }
};
