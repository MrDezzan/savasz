'use client';

import Link from 'next/link';
import { AllianceMember, AllianceRole } from '@/lib/types/alliance';
import { IconSearch, IconCrown, IconCrownOutline, IconBan } from '@/components/ui/icons';
import { useState } from 'react';

interface MemberListProps {
    members: AllianceMember[];
    currentUserRole?: AllianceRole;
    onMemberAction?: (username: string, action: 'promote' | 'demote' | 'kick') => void;
}

export default function MemberList({ members, currentUserRole, onMemberAction }: MemberListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = members.filter(m =>
        m.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort: Leader first, then deputies, then members
    const sortedMembers = [...filteredMembers].sort((a, b) => {
        const order: Record<AllianceRole, number> = { LEADER: 0, DEPUTY: 1, MEMBER: 2 };
        return order[a.role] - order[b.role];
    });

    const getRoleIcon = (role: AllianceRole) => {
        switch (role) {
            case 'LEADER':
                return <IconCrown size={14} className="member-role-icon leader" />;
            case 'DEPUTY':
                return <IconCrownOutline size={14} className="member-role-icon deputy" />;
            default:
                return null;
        }
    };

    const canManageMember = (memberRole: AllianceRole) => {
        if (!currentUserRole) return false;
        if (currentUserRole === 'LEADER') return memberRole !== 'LEADER';
        if (currentUserRole === 'DEPUTY') return memberRole === 'MEMBER';
        return false;
    };

    return (
        <div className="member-list">
            <div className="member-list-header">
                <h3 className="member-list-title">
                    Участники
                    <span className="member-count">{members.length}</span>
                </h3>
            </div>

            {/* Search */}
            <div className="member-search">
                <IconSearch size={16} className="search-icon" />
                <input
                    type="text"
                    placeholder="Найти участника..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="member-search-input"
                />
            </div>

            {/* Members */}
            <div className="member-list-content">
                {sortedMembers.map(member => (
                    <div
                        key={member.username}
                        className={`member-item ${member.isBanned ? 'banned' : ''}`}
                    >
                        <Link href={`/profile/${member.username}`} className="member-link">
                            <div className="member-avatar-wrapper">
                                <img
                                    src={member.avatarUrl || `https://mc-heads.net/avatar/${member.username}/32`}
                                    alt={member.username}
                                    className="member-avatar"
                                />
                                {member.isOnline && <span className="online-dot" />}
                            </div>
                            <div className="member-info">
                                <span className={`member-name ${member.isBanned ? 'banned' : ''}`}>
                                    {member.username}
                                </span>
                                {getRoleIcon(member.role)}
                                {member.isBanned && <IconBan size={12} className="ban-icon" />}
                            </div>
                        </Link>

                        {/* Management actions */}
                        {canManageMember(member.role) && onMemberAction && (
                            <div className="member-actions">
                                {currentUserRole === 'LEADER' && member.role === 'MEMBER' && (
                                    <button
                                        className="member-action-btn"
                                        onClick={() => onMemberAction(member.username, 'promote')}
                                        title="Назначить заместителем"
                                    >
                                        <IconCrownOutline size={14} />
                                    </button>
                                )}
                                {currentUserRole === 'LEADER' && member.role === 'DEPUTY' && (
                                    <button
                                        className="member-action-btn"
                                        onClick={() => onMemberAction(member.username, 'demote')}
                                        title="Снять с поста"
                                    >
                                        <IconCrownOutline size={14} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
