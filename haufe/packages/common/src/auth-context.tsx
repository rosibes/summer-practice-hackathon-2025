"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import axios from "axios";

export type User = {
    id: string;
    email: string;
    username: string;
};

export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return false;
        }

        try {
            const response = await axios.get(`http://localhost:3001/api/v1/users/me`, {
                headers: {
                    Authorization: `${token}`
                }
            });

            const { userId, email, username } = response.data;
            const userData = {
                id: userId,
                email,
                username
            };

            setUser(userData);
            setIsAuthenticated(true);
            setIsLoading(false);
            return true;
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem("token");
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
            return false;
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback((token: string, userData: User) => {
        localStorage.setItem("token", token);
        setUser(userData);
        setIsAuthenticated(true);
        setIsLoading(false);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
    }, []);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
} 