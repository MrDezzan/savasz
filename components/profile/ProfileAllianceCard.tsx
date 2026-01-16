'use client';

import Link from 'next/link';
import { IconCrown, IconCrownOutline, IconUsers } from '@/components/ui/icons';

interface AllianceInfo {
    id: number;
    shortName: string;
    fullName: string;
    color: string;
    logoSvg?: string;
    role: 'LEADER' | 'DEPUTY' | 'MEMBER';
    memberCount: number;
}

interface ProfileAllianceCardProps {
    alliance: AllianceInfo;
}

export default function ProfileAllianceCard({ alliance }: ProfileAllianceCardProps) {
    const getRoleLabel = () => {
        switch (alliance.role) {
            case 'LEADER': return { icon: <IconCrown size={14} />, text: 'Лидер' };
            case 'DEPUTY': return { icon: <IconCrownOutline size={14} />, text: 'Заместитель' };
            case 'MEMBER': return { icon: null, text: 'Участник' };
        }
    };

    const role = getRoleLabel();

    return (
        <Link href={`/alliances/${alliance.id}`} className="profile-alliance-card">
            <div className="alliance-logo-mini" style={{ borderColor: alliance.color }}>
                {alliance.logoSvg ? (
                    <div dangerouslySetInnerHTML={{ __html: alliance.logoSvg }} />
                ) : (
                    <span style={{ color: alliance.color }}>{alliance.shortName.charAt(0)}</span>
                )}
            </div>
            <div className="alliance-info-mini">
                <span className="alliance-name-mini">{alliance.fullName}</span>
                <div className="alliance-meta-mini">
                    <span className="alliance-role" style={{ color: alliance.role === 'LEADER' ? '#fbbf24' : alliance.role === 'DEPUTY' ? 'var(--accent-light)' : 'var(--text-muted)' }}>
                        {role.icon}
                        {role.text}
                    </span>
                    <span className="alliance-members-mini">
                        <IconUsers size={12} />
                        {alliance.memberCount}
                    </span>
                </div>
            </div>
        </Link>
    );
}
