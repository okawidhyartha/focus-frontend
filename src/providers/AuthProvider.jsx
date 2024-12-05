import { createContext, useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AUTH_USERNAME_KEY } from "../helpers/constants";
import { signIn as apiSignIn, signUp as apiSignUp } from "../apis/auth";
import { jwtDecode } from "jwt-decode";
import { setupInterceptors } from "../apis";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [authUsername, setAuthUsername] = useState(null);
  const afterSignUp = useRef(false);

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

      afterSignUp.current = true;

      saveAuthUsername(username);
    },
    [saveAuthUsername]
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_USERNAME_KEY);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuthUsername(null);
  }, []);

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return;
    const refreshTokenDecoded = jwtDecode(refreshToken);
    if (refreshTokenDecoded.exp * 1000 < Date.now()) {
      signOut();
    } else {
      const timer = setTimeout(() => {
        signOut();
      }, refreshTokenDecoded.exp * 1000 - Date.now());

      return () => clearTimeout(timer);
    }
  }, [signOut]);

  useEffect(() => {
    setupInterceptors(signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        authUsername,
        afterSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
