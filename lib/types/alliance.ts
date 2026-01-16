// Alliance Types

export type AllianceRole = 'LEADER' | 'DEPUTY' | 'MEMBER';
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';
export type RecruitmentStatus = 'OPEN' | 'CLOSED' | 'BY_INVITE';

export interface Alliance {
    id: number;
    shortName: string;
    fullName: string;
    description: string;
    logoSvg: string;
    color: string;

    // Leader info
    leaderUsername: string;
    leaderAvatarUrl?: string;

    // Stats
    memberCount: number;
    createdAt: string;

    // Settings
    recruitmentStatus: RecruitmentStatus;
    discordUrl?: string;
    hasDiscord: boolean;
}

export interface AllianceMember {
    username: string;
    avatarUrl?: string;
    role: AllianceRole;
    joinedAt: string;
    isOnline?: boolean;
    isBanned?: boolean;
}

export interface AllianceApplication {
    id: number;
    allianceId: number;
    applicantUsername: string;
    applicantAvatarUrl?: string;

    // Form answers
    age: number;
    purpose: string;
    about: string;

    // Status
    status: ApplicationStatus;
    rejectionReason?: string;

    // Timestamps
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
}

export interface AllianceInvite {
    id: number;
    allianceId: number;
    invitedUsername: string;
    invitedBy: string;
    createdAt: string;
    expiresAt: string;
}
