'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { validateSession, getProfile } from '@/lib/api';

interface User {
    username: string;
    token: string;
}

interface UserTags {
    isAdmin: boolean;
    isModerator: boolean;
    hasSubscription: boolean;
    subscriptionExpires?: string;
}

interface AuthContextType {
    user: User | null;
    userTags: UserTags | null;
    loading: boolean;
    login: (token: string, username: string) => void;
    logout: () => void;
    refreshAuth: () => Promise<void>;
    refreshTags: () => Promise<void>;
    canManageTags: boolean;
    isAdmin: boolean;
}

const DEFAULT_TAGS: UserTags = {
    isAdmin: false,
    isModerator: false,
    hasSubscription: false,
};

const AuthContext = createContext<AuthContextType | null>(null);

// Имена пользователей с правом управления тегами
const TAG_MANAGERS = ['IDezzan'];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userTags, setUserTags] = useState<UserTags | null>(null);
    const [loading, setLoading] = useState(true);

    // Загрузка тегов из localStorage
    const loadCachedTags = (username: string): UserTags | null => {
        try {
            const cached = localStorage.getItem(`sylvaire_tags_${username}`);
            if (cached) {
                const data = JSON.parse(cached);
                // Проверяем, не устарел ли кэш (1 час)
                if (data.timestamp && Date.now() - data.timestamp < 3600000) {
                    return data.tags;
                }
            }
        } catch {
            // Ignore parsing errors
        }
        return null;
    };

    // Сохранение тегов в localStorage
    const saveCachedTags = (username: string, tags: UserTags) => {
        try {
            localStorage.setItem(`sylvaire_tags_${username}`, JSON.stringify({
                tags,
                timestamp: Date.now(),
            }));
        } catch {
            // Ignore storage errors
        }
    };

    // Очистка кэшированных тегов
    const clearCachedTags = (username?: string) => {
        try {
            if (username) {
                localStorage.removeItem(`sylvaire_tags_${username}`);
            }
        } catch {
            // Ignore
        }
    };

    // Загрузка тегов с сервера
    const fetchTags = useCallback(async (username: string): Promise<UserTags> => {
        try {
            const profile = await getProfile(username);
            if (profile) {
                const tags: UserTags = {
                    isAdmin: profile.tags?.some(t => t.name === 'Админ') ?? false,
                    isModerator: profile.tags?.some(t => t.name === 'Модератор') ?? false,
                    hasSubscription: profile.tags?.some(t => t.name === '+') ?? false,
                    subscriptionExpires: profile.subscriptionExpires,
                };
                saveCachedTags(username, tags);
                return tags;
            }
        } catch (e) {
            console.error('[Auth] Failed to fetch tags:', e);
        }
        return DEFAULT_TAGS;
    }, []);

    const refreshTags = useCallback(async () => {
        if (!user?.username) return;
        const tags = await fetchTags(user.username);
        setUserTags(tags);
    }, [user?.username, fetchTags]);

    const refreshAuth = useCallback(async () => {
        const token = localStorage.getItem('sylvaire_token');
        const username = localStorage.getItem('sylvaire_username');

        if (!token || !username) {
            setUser(null);
            setUserTags(null);
            setLoading(false);
            return;
        }

        try {
            const data = await validateSession(token);
            if (data.valid) {
                const validUsername = data.username || username;
                if (validUsername) {
                    setUser({ username: validUsername, token });

                    // Сначала загружаем кэшированные теги для быстрого отображения
                    const cachedTags = loadCachedTags(validUsername);
                    if (cachedTags) {
                        setUserTags(cachedTags);
                    }

                    // Затем обновляем с сервера (синхронизация с LuckPerms)
                    const freshTags = await fetchTags(validUsername);
                    setUserTags(freshTags);
                } else {
                    localStorage.removeItem('sylvaire_token');
                    localStorage.removeItem('sylvaire_username');
                    setUser(null);
                    setUserTags(null);
                }
            } else {
                localStorage.removeItem('sylvaire_token');
                localStorage.removeItem('sylvaire_username');
                setUser(null);
                setUserTags(null);
            }
        } catch {
            setUser(null);
            setUserTags(null);
        } finally {
            setLoading(false);
        }
    }, [fetchTags]);

    useEffect(() => {
        refreshAuth();
    }, [refreshAuth]);

    const login = useCallback((token: string, username: string) => {
        localStorage.setItem('sylvaire_token', token);
        localStorage.setItem('sylvaire_username', username);
        setUser({ username, token });
        // Загружаем теги после входа
        fetchTags(username).then(setUserTags);
    }, [fetchTags]);

    const logout = useCallback(() => {
        const username = user?.username;
        localStorage.removeItem('sylvaire_token');
        localStorage.removeItem('sylvaire_username');
        if (username) {
            clearCachedTags(username);
        }
        setUser(null);
        setUserTags(null);
    }, [user?.username]);

    // Проверка права управления тегами
    const canManageTags = user ? (TAG_MANAGERS.includes(user.username) || (userTags?.isAdmin ?? false)) : false;

    // Прямой доступ к isAdmin
    const isAdmin = userTags?.isAdmin ?? false;

    return (
        <AuthContext.Provider value={{
            user,
            userTags,
            loading,
            login,
            logout,
            refreshAuth,
            refreshTags,
            canManageTags,
            isAdmin,
        }}>
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
