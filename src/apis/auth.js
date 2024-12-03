import { publicApi, handleApiError } from ".";

export const signIn = async (email, password) => {
  try {
    const resp = await publicApi.post("/signin", { email, password });
    return resp.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const signUp = async (email, password) => {
  try {
    const resp = await publicApi.post("/signup", { email, password });
    return resp.data;
  } catch (error) {
    handleApiError(error);
  }
};
