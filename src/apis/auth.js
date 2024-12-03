import { publicApi, handleApiError } from ".";

export const signIn = async (username, password) => {
  try {
    const resp = await publicApi.post("/signin", { username, password });
    return resp.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const signUp = async (username, password) => {
  try {
    const resp = await publicApi.post("/signup", { username, password });
    return resp.data;
  } catch (error) {
    handleApiError(error);
  }
};
