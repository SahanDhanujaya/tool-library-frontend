/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import type { User } from "../types/user";

const AuthContext = createContext({
    user: {} as User,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    saveUser: (user: User) => {}
});

const AuthProvider = ({children}: {children:React.ReactNode}) => {
    const [user, setUser] = useState<User>({} as User);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
        // Connect to your User Service here
       

    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    const saveUser = (user: User) => {
        setUser(user);
    };

    return (
        <AuthContext.Provider value={{ user , isAuthenticated, login, logout, saveUser }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };