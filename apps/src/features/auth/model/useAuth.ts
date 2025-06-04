'use client';
import { useState, useEffect } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/features/auth/lib/auth';

export const useAuth = () => {
    const [token, setTokenState] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const storedToken = getAuthToken();
        if (storedToken) {
            setTokenState(storedToken);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (newToken: string) => {
        setAuthToken(newToken);
        setTokenState(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        removeAuthToken();
        setTokenState(null);
        setIsAuthenticated(false);
    };

    return {
        token,
        isAuthenticated,
        login,
        logout,
    };
};