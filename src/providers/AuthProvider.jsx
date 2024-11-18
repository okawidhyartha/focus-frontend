import { createContext, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { API_URL, AUTH_USERNAME_KEY } from "../helpers/constants";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [authUsername, setAuthUsername] = useState(null);

  const loadAuthUsername = useCallback(() => {
    const username = localStorage.getItem(AUTH_USERNAME_KEY);
    setAuthUsername(username);
  }, []);

  useEffect(() => {
    loadAuthUsername();
  }, [loadAuthUsername]);

  const saveAuthUsername = useCallback((username) => {
    localStorage.setItem(AUTH_USERNAME_KEY, username);
    setAuthUsername(username);
  }, []);

  const signIn = useCallback(
    async (username, password) => {
      const resp = await fetch(API_URL + "/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const json = await resp.json();

      if (!resp.ok) throw new Error(json.message);

      saveAuthUsername(username);
    },
    [saveAuthUsername]
  );

  const signUp = useCallback(
    async (username, password) => {
      const resp = await fetch(API_URL + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const json = await resp.json();

      if (!resp.ok) throw new Error(json.message);

      saveAuthUsername(username);
    },
    [saveAuthUsername]
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_USERNAME_KEY);
    setAuthUsername(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        authUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
