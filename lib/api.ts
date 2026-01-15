import { config } from './config';

interface FetchOptions extends RequestInit {
    token?: string;
}

export async function api<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${config.apiUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

// Server stats
export interface ServerStats {
    online: number;
    max: number;
    totalPlayers: number;
    tps: number;
}

export async function getServerStats(): Promise<ServerStats> {
    const data = await api<{
        success: boolean;
        server: {
            online: number;
            maxPlayers: number;
            totalPlayers: number;
            tps: number;
        }
    }>('/api/server');

    return {
        online: data.server?.online ?? 0,
        max: data.server?.maxPlayers ?? 20,
        totalPlayers: data.server?.totalPlayers ?? 0,
        tps: data.server?.tps ?? 20.0,
    };
}

// Player profile
export interface PlayerProfile {
    uuid: string;
    username: string;
    isOnline: boolean;
    skinUrl: string;
    avatarUrl: string;
    totalPlaytimeSeconds: number;
    formattedPlaytime: string;

    joinCount: number;
    firstJoin: string;
    lastSeen: string;
    hoursSinceLastSeen: number;
    description: string | null;
    discordId: string | null;

    weekPlaytimeSeconds?: number;
    weekPlaytimeFormatted?: string;
    monthPlaytimeSeconds?: number;
    monthPlaytimeFormatted?: string;

    tags: {
        name: string;
        color: string;
        icon?: string;
        expiresIn?: string;
        expiresAt?: string;
    }[];
    organization?: Organization;
    hasSubscription?: boolean;
    subscriptionExpiry?: string;
    subscriptionExpires?: string;
}

export interface Organization {
    id: number;
    shortName: string;
    fullName: string;
    bannerUrl?: string;
    creator: string;
    createdAt?: string;
}

export async function getProfile(username: string): Promise<PlayerProfile | null> {
    try {
        const data = await api<{ success: boolean; profile: PlayerProfile }>(`/api/profile/${encodeURIComponent(username)}`);
        return data.success ? data.profile : null;
    } catch (e) {
        console.error(`[API] Failed to fetch profile for ${username}:`, e);
        return null;
    }
}

export async function updateDescription(username: string, description: string, token: string): Promise<{ success: boolean; error?: string }> {
    return api(`/api/profile/${encodeURIComponent(username)}/description`, {
        method: 'POST',
        body: JSON.stringify({ description }),
        token,
    });
}

// Leaderboard
export type LeaderboardPeriod = 'ALL_TIME' | 'SEASON' | 'MONTH' | 'WEEK';

export interface LeaderboardEntry {
    uuid: string;
    username: string;
    totalPlaytimeSeconds: number;
    formattedPlaytime: string;
    joinCount: number;
    isOnline: boolean;
}

export async function getLeaderboard(period: LeaderboardPeriod = 'ALL_TIME'): Promise<LeaderboardEntry[]> {
    const endpoint = period === 'ALL_TIME' ? '/api/leaderboard' : `/api/leaderboard/period?period=${period}`;
    const data = await api<{ success: boolean; leaderboard: LeaderboardEntry[]; players?: LeaderboardEntry[] }>(endpoint);
    // Backend sends 'leaderboard' for period queries and 'leaderboard' (or 'players'?) for simple query?
    // Checking WebServer.java line 620: "leaderboard", result
    // Checking WebServer.java line 658: "leaderboard", result
    // So both return 'leaderboard'.
    return data.leaderboard || data.players || [];
}

// Feed
export interface FeedPost {
    id: number;
    authorUsername: string;
    content: string;
    createdAt: string;
    isAdmin?: boolean;
    hasSubscription?: boolean;
}

export async function getFeed(page = 0): Promise<{ posts: FeedPost[]; hasMore: boolean; total: number }> {
    const data = await api<{ success: boolean; posts: FeedPost[]; hasMore: boolean; total: number }>(`/api/feed?page=${page}`);
    return data;
}

export async function createPost(content: string, token: string): Promise<{ success: boolean; postId?: number; error?: string }> {
    return api('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content }),
        token,
    });
}

// Auth
export async function requestAuth(username: string): Promise<{ success: boolean; error?: string }> {
    return api('/api/auth/request', {
        method: 'POST',
        body: JSON.stringify({ username }),
    });
}

export async function verifyAuth(username: string, code: string): Promise<{ success: boolean; token?: string; error?: string; denied?: boolean }> {
    return api('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ username, code }),
    });
}

export async function validateSession(token: string): Promise<{ success: boolean; valid: boolean; username?: string }> {
    return api('/api/auth/session', { token });
}
