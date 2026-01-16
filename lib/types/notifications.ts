// Notification Types

export type NotificationType =
    | 'APPLICATION_ACCEPTED'
    | 'APPLICATION_REJECTED'
    | 'NEW_APPLICATION'
    | 'NEW_COMMENT'
    | 'POST_LIKED'
    | 'ALLIANCE_INVITE'
    | 'SYSTEM';

export interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;

    // Links
    linkUrl?: string;
    linkLabel?: string;

    // Related data
    relatedUsername?: string;
    relatedAllianceId?: number;
    relatedPostId?: number;
}
