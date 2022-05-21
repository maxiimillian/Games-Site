import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useRouter } from "next/router";
import * as userApi from "../api/user";

const AuthContext = createContext({});

export function AuthProvider({children}) {
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (error) setError(null);
    }, [router.pathname]);

    useEffect(() => {
        console.log("getting user...")
        setLoading(true);
        userApi.getUser()
        .then((user) => setUser(user.profile))
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    }, []);

    async function login(user, password) {
        setLoading(true);

        await userApi.login(user, password)
        .then((user) => setUser(user.profile))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }

    async function register(username, password, email) {
        setLoading(true);
        console.log("here...")

        await userApi.register(username, password, email)
        .then((user) => {
            console.log("USER => ", user);
            setUser(user.profile)
            localStorage.setItem("token", user.token)
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }

    function logout() {
        userApi.logout()
        .then(() => setUser(undefined));
    }

    const memoedValue = useMemo(
        () => ({
            user, 
            loading,
            error,
            login,
            register,
            logout,
        }),
        [user, loading, error]
    );

    return (
        <AuthContext.Provider value={memoedValue}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext);
}
