export type LogActionType =
    | 'ALLIANCE_CREATED'
    | 'ALLIANCE_DELETED'
    | 'ALLIANCE_UPDATED'
    | 'APPLICATION_ACCEPTED'
    | 'APPLICATION_REJECTED'
    | 'POST_DELETED'
    | 'COMMENT_DELETED'
    | 'USER_BANNED'
    | 'USER_UNBANNED'
    | 'ROLE_CHANGED'
    | 'LEADERSHIP_TRANSFERRED';

export interface LogEntry {
    id: number;
    type: LogActionType;
    initiatorUsername: string;
    initiatorRole: 'ADMIN' | 'LEADER' | 'DEPUTY';
    targetType: 'USER' | 'ALLIANCE' | 'POST' | 'COMMENT' | 'APPLICATION';
    targetId: number;
    targetName: string;
    reason?: string;
    details?: string;
    createdAt: string;
}

export interface LogFilters {
    type?: LogActionType;
    initiator?: string;
    dateFrom?: string;
    dateTo?: string;
}
