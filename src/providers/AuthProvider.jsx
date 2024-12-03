import { createContext, useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AUTH_USERNAME_KEY } from "../helpers/constants";
import { signIn as apiSignIn, signUp as apiSignUp } from "../apis/auth";

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
      const { data } = await apiSignIn(username, password);
      const { access_token, refresh_token } = data;

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      saveAuthUsername(username);
    },
    [saveAuthUsername]
  );

  const signUp = useCallback(
    async (username, password) => {
      const { data } = await apiSignUp(username, password);
      const { access_token, refresh_token } = data;

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

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
