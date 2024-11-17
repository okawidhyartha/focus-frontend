import { createContext, useCallback, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [authUsername, setAuthUsername] = useState(null);

  const signIn = useCallback(async (username, password) => {
    const resp = await fetch("http://18.141.159.229:5050/signin", {
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

    setAuthUsername(username);
  }, []);

  const signUp = useCallback(async (username, password) => {
    const resp = await fetch("http://18.141.159.229:5050/signup", {
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

    setAuthUsername(username);
  }, []);

  const signOut = useCallback(() => {
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
