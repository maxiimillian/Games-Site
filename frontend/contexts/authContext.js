import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/router";
import * as userApi from "../api/user";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(user?.token);

  const router = useRouter();

  useEffect(() => {
    if (error) setError(null);
  }, [router.pathname]);

  useEffect(() => {
    setLoading(true);
    userApi
      .getUser()
      .then((user) => setUser(user.profile))
      .then((response) => {
        return response;
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  async function login(user, password) {
    setLoading(true);

    await userApi
      .login(user, password)
      .then((user) => setUser(user.profile))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  async function register(username, password, email) {
    setLoading(true);

    await userApi
      .register(username, password, email)
      .then((user) => {
        setUser(user.profile);
        setToken(user.token);
        localStorage.setItem("token", user.token);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function logout() {
    userApi.logout().then(() => setUser(undefined));
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      token,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
