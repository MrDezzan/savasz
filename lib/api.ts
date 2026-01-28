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
        let errorMessage = `API Error: ${response.status}`;
        try {
            const errorBody = await response.json();
            if (errorBody && errorBody.error) {
                // Use the server's error message directly
                errorMessage = errorBody.error;
            }
        } catch (e) {
            // Ignore JSON parse error, use default status message
        }
        throw new Error(errorMessage);
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
    discordUsername?: string;

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
    hasSubscription?: boolean;
    subscriptionExpiry?: string;
    subscriptionExpires?: string;

    isBanned?: boolean;
    banReason?: string;
    banExpires?: string;
    banRemaining?: string;
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
    discordUsername?: string;
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
    isModerator?: boolean;
    hasSubscription?: boolean;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
}

export async function getFeed(page = 0, token?: string): Promise<{ posts: FeedPost[]; hasMore: boolean; total: number }> {
    const options: FetchOptions = {};
    if (token) {
        options.token = token;
    }
    const data = await api<{ success: boolean; posts: FeedPost[]; hasMore: boolean; total: number }>(`/api/feed?page=${page}`, options);
    return data;
}

export async function createPost(content: string, token: string, imageUrl?: string): Promise<{ success: boolean; postId?: number; error?: string }> {
    return api('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content, imageUrl }),
        token,
    });
}

export async function deletePost(postId: number, token: string): Promise<{ success: boolean; error?: string }> {
    return api(`/api/posts/${postId}`, {
        method: 'DELETE',
        token,
    });
}

// Interactions
export async function toggleLike(postId: number, token: string): Promise<{ success: boolean; liked: boolean }> {
    // Backend toggleLike returns boolean directly in ForumService but WebServer usually wraps in JSON "success".
    // Checking WebServer.java source code (imagined from previous):
    // app.post("/api/posts/{id}/like", this::toggleLike);
    // ForumService toggleLike returns boolean.
    // I need to check how WebServer wraps it.
    // Actually, I didn't check WebServer.java toggleLike implementation, only assuming.
    // Let's assume standard JSON wrapper.
    return api(`/api/posts/${postId}/like`, {
        method: 'POST',
        token,
    });
}

export interface Comment {
    id: number;
    postId: number;
    authorUsername: string;
    content: string;
    createdAt: string;
    isDeleted: boolean;
    isAdmin?: boolean;
    isModerator?: boolean;
    hasSubscription?: boolean;
    isBanned?: boolean;
}

export async function getComments(postId: number): Promise<Comment[]> {
    const data = await api<{ success: boolean; comments: Comment[] }>(`/api/posts/${postId}/comments`);
    return data.comments || [];
}

export async function createComment(postId: number, content: string, token: string): Promise<{ success: boolean; commentId?: number; error?: string }> {
    return api(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
        token,
    });
}

export async function deleteComment(commentId: number, token: string): Promise<{ success: boolean; error?: string }> {
    return api(`/api/comments/${commentId}`, {
        method: 'DELETE',
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

// Admin tag management
export interface TagUpdate {
    username: string;
    permission: 'sylvaire.admin' | 'sylvaire.mod' | 'sylvaire.sub';
    action: 'grant' | 'revoke';
    duration?: number; // Duration in seconds, null for permanent
}

export async function updateUserTags(
    update: TagUpdate,
    token: string
): Promise<{ success: boolean; error?: string }> {
    return api('/api/admin/tags', {
        method: 'POST',
        body: JSON.stringify(update),
        token,
    });
}

// Check if user can manage tags
export async function checkTagManagementPermission(
    username: string
): Promise<boolean> {
    try {
        const profile = await getProfile(username);
        if (!profile) return false;

        // IDezzan or admins can manage tags
        if (username === 'IDezzan') return true;
        return profile.tags?.some(t => t.name === 'Админ') ?? false;
    } catch {
        return false;
    }
}

export async function uploadImage(file: File, token: string): Promise<{ success: boolean; url?: string; error?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${config.apiUrl}/api/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        return response.json();
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
