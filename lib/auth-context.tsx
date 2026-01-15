'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { validateSession } from '@/lib/api';

interface User {
    username: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, username: string) => void;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshAuth = useCallback(async () => {
        const token = localStorage.getItem('sylvaire_token');
        const username = localStorage.getItem('sylvaire_username');

        if (!token || !username) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const data = await validateSession(token);
            if (data.valid && data.username) {
                setUser({ username: data.username, token });
            } else {
                localStorage.removeItem('sylvaire_token');
                localStorage.removeItem('sylvaire_username');
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    const login = useCallback((token: string, username: string) => {
        localStorage.setItem('sylvaire_token', token);
        localStorage.setItem('sylvaire_username', username);
        setUser({ username, token });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('sylvaire_token');
        localStorage.removeItem('sylvaire_username');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
