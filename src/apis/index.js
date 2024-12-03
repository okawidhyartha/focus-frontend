import axios from "axios";
import { API_URL, AUTH_USERNAME_KEY } from "../helpers/constants";

const config = {
  baseURL: API_URL,
  timeout: 5000,
};

export const publicApi = axios.create(config);

export const privateApi = axios.create(config);

// Attach Authorization header to privateApi requests
privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Get token from storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (!token) {
      // Cancel the request if no token
      return Promise.reject({
        message: "No access token available",
        cancelRequest: true, // Custom flag for easier handling
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired tokens in the response interceptor
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.cancelRequest) return null;
    const username = localStorage.getItem(AUTH_USERNAME_KEY);
    if (error.response?.status === 401 && username) {
      // Token expired, attempt to refresh
      try {
        const refreshToken = localStorage.getItem("refreshToken"); // Get refresh token
        if (!refreshToken) {
          throw new Error("Refresh token not found");
        }

        // Call the refresh token endpoint
        const { data } = await publicApi.post("/refresh-token", {
          refreshToken,
        });

        const { token } = data;

        // Save the new access token
        localStorage.setItem("accessToken", token);

        // Retry the failed request with the new access token
        error.config.headers["Authorization"] = `Bearer ${token}`;
        return privateApi.request(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    // For other errors, reject the promise
    return Promise.reject(error);
  }
);

export const handleApiError = (error, defaultMessage) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data.message;
    throw new Error(message);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    throw new Error("Error connecting to server");
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(defaultMessage ?? "Something went wrong");
  }
};
