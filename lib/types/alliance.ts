
export type AllianceRole = 'LEADER' | 'DEPUTY' | 'MEMBER';

export interface Alliance {
    id: number;
    shortName: string;
    fullName: string;
    color: string;
    logoSvg?: string;
    description?: string;
    memberCount: number;
    leaderUsername?: string;
    createdAt?: string;

    // Optional current user role in this alliance
    currentUserRole?: AllianceRole;
}

export interface AllianceMember {
    uuid: string;
    username: string;
    role: AllianceRole;
    joinedAt: string;
    skinUrl?: string;
}

// Minimal alliance info for embedding in other objects (like posts)
export interface AllianceSummary {
    id: number;
    shortName: string;
    fullName: string;
    color: string;
    logoSvg?: string;
}
