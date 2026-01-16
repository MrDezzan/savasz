// Feed & Post Types

export interface Post {
    id: number;
    authorUsername: string;
    authorAvatarUrl?: string;
    content: string;
    imageUrl?: string;
    createdAt: string;

    // Author info
    isAdmin?: boolean;
    isModerator?: boolean;
    hasSubscription?: boolean;
    isBanned?: boolean;

    // Alliance info (if author is in alliance)
    alliance?: {
        id: number;
        shortName: string;
        fullName: string;
        color: string;
        logoSvg?: string;
    };

    // Engagement
    likesCount: number;
    commentsCount: number;
    isLikedByMe?: boolean;
}

export interface Comment {
    id: number;
    postId: number;
    authorUsername: string;
    authorAvatarUrl?: string;
    content: string;
    createdAt: string;

    isAdmin?: boolean;
    isModerator?: boolean;
    hasSubscription?: boolean;
    isBanned?: boolean;
}

export interface FeedFilters {
    sort: 'newest' | 'popular';
    period: 'day' | 'week' | 'month' | 'all';
}
