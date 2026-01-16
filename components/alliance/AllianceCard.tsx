'use client';

import Link from 'next/link';
import { Alliance } from '@/lib/types/alliance';
import { IconUsers, IconDiscord, IconCrown } from '@/components/ui/icons';

interface AllianceCardProps {
    alliance: Alliance;
}

export default function AllianceCard({ alliance }: AllianceCardProps) {
    const getRecruitmentLabel = () => {
        switch (alliance.recruitmentStatus) {
            case 'OPEN': return { text: 'Набор открыт', class: 'open' };
            case 'CLOSED': return { text: 'Набор закрыт', class: 'closed' };
            case 'BY_INVITE': return { text: 'По приглашению', class: 'invite' };
        }
    };

    const recruitment = getRecruitmentLabel();

    return (
        <Link href={`/alliances/${alliance.id}`} className="alliance-card">
            {/* Logo */}
            <div className="alliance-card-logo" style={{ borderColor: alliance.color }}>
                {alliance.logoSvg ? (
                    <div
                        className="alliance-logo-svg"
                        dangerouslySetInnerHTML={{ __html: alliance.logoSvg }}
                    />
                ) : (
                    <span className="alliance-logo-placeholder" style={{ color: alliance.color }}>
                        {alliance.shortName.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="alliance-card-info">
                <div className="alliance-card-header">
                    <h3 className="alliance-card-name">{alliance.fullName}</h3>
                    <span className="alliance-card-short" style={{ color: alliance.color }}>
                        @{alliance.shortName}
                    </span>
                </div>

                <p className="alliance-card-description">{alliance.description}</p>

                {/* Leader */}
                <div className="alliance-card-leader">
                    <IconCrown size={14} className="leader-crown" />
                    <img
                        src={alliance.leaderAvatarUrl || `https://mc-heads.net/avatar/${alliance.leaderUsername}/24`}
                        alt={alliance.leaderUsername}
                        className="leader-avatar"
                    />
                    <span className="leader-name">{alliance.leaderUsername}</span>
                </div>
            </div>

            {/* Meta */}
            <div className="alliance-card-meta">
                <div className="alliance-card-stats">
                    <div className="alliance-stat">
                        <IconUsers size={16} />
                        <span>{alliance.memberCount}</span>
                    </div>
                    {alliance.hasDiscord && (
                        <div className="alliance-stat discord">
                            <IconDiscord size={16} />
                        </div>
                    )}
                </div>
                <span className={`recruitment-badge ${recruitment.class}`}>
                    {recruitment.text}
                </span>
            </div>
        </Link>
    );
}
