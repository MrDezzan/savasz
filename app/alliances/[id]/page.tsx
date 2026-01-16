'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Alliance, AllianceMember } from '@/lib/types/alliance';
import { Post } from '@/lib/types/feed';
import { MemberList } from '@/components/alliance';
import { PostCard } from '@/components/feed';
import { IconArrowLeft, IconDiscord, IconUsers, IconCrown, IconPlus } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

// Mock data
const mockAlliance: Alliance = {
    id: 2,
    shortName: 'BLD',
    fullName: 'Builders Guild',
    description: 'Гильдия строителей. Создаём масштабные проекты и помогаем новичкам освоить строительство. Присоединяйтесь к нашей команде!',
    logoSvg: '<svg viewBox="0 0 16 16" fill="#3b82f6"><polygon points="8,2 14,14 2,14"/></svg>',
    color: '#3b82f6',
    leaderUsername: 'MasterBuilder',
    memberCount: 12,
    createdAt: '2024-02-15',
    recruitmentStatus: 'OPEN',
    hasDiscord: true,
    discordUrl: 'https://discord.gg/example',
};

const mockMembers: AllianceMember[] = [
    { username: 'MasterBuilder', role: 'LEADER', joinedAt: '2024-02-15', isOnline: true },
    { username: 'ArchitectPro', role: 'DEPUTY', joinedAt: '2024-02-20', isOnline: true },
    { username: 'BuilderJohn', role: 'MEMBER', joinedAt: '2024-03-01', isOnline: false },
    { username: 'CreativeMike', role: 'MEMBER', joinedAt: '2024-03-05', isOnline: true },
    { username: 'BlockMaster', role: 'MEMBER', joinedAt: '2024-03-10', isOnline: false },
];

const mockPosts: Post[] = [
    {
        id: 10,
        authorUsername: 'MasterBuilder',
        content: 'Новый проект гильдии: строим средневековый замок! Присоединяйтесь к строительству.',
        imageUrl: 'https://via.placeholder.com/600x400/1a1a2e/ffffff?text=Castle+Build',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        likesCount: 15,
        commentsCount: 7,
        alliance: { id: 2, shortName: 'BLD', fullName: 'Builders Guild', color: '#3b82f6' },
    },
];

export default function AllianceDetailPage() {
    const params = useParams();
    const { user } = useAuth();
    const [alliance, setAlliance] = useState<Alliance | null>(null);
    const [members, setMembers] = useState<AllianceMember[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Check if current user is member/leader/deputy
    const currentMember = members.find(m => m.username === user?.username);
    const isLeaderOrDeputy = currentMember?.role === 'LEADER' || currentMember?.role === 'DEPUTY';
    const isMember = !!currentMember;

    useEffect(() => {
        const loadAlliance = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));
            setAlliance(mockAlliance);
            setMembers(mockMembers);
            setPosts(mockPosts);
            setLoading(false);
        };

        loadAlliance();
    }, [params.id]);

    if (loading) {
        return (
            <div className="alliance-detail-page">
                <div className="alliance-loading">
                    <div className="loading-spinner" />
                    <p>Загрузка альянса...</p>
                </div>
            </div>
        );
    }

    if (!alliance) {
        return (
            <div className="alliance-detail-page">
                <div className="alliance-not-found">
                    <h2>Альянс не найден</h2>
                    <Link href="/alliances" className="back-link">
                        <IconArrowLeft size={18} />
                        К списку альянсов
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="alliance-detail-page">
            {/* Header */}
            <div className="alliance-detail-header">
                <Link href="/alliances" className="back-link">
                    <IconArrowLeft size={18} />
                    Альянсы
                </Link>

                <div className="alliance-hero">
                    <div className="alliance-logo-large" style={{ borderColor: alliance.color }}>
                        <div
                            className="alliance-logo-svg-large"
                            dangerouslySetInnerHTML={{ __html: alliance.logoSvg }}
                        />
                    </div>

                    <div className="alliance-hero-info">
                        <h1 className="alliance-name">{alliance.fullName}</h1>
                        <span className="alliance-tag" style={{ color: alliance.color }}>@{alliance.shortName}</span>
                        <p className="alliance-description">{alliance.description}</p>

                        <div className="alliance-stats-row">
                            <div className="alliance-stat-item">
                                <IconUsers size={18} />
                                <span>{alliance.memberCount} участников</span>
                            </div>
                            {alliance.hasDiscord && (
                                <a
                                    href={alliance.discordUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="alliance-stat-item discord"
                                >
                                    <IconDiscord size={18} />
                                    <span>Discord</span>
                                </a>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="alliance-actions">
                            {!isMember && alliance.recruitmentStatus === 'OPEN' && (
                                <Link href={`/alliances/${alliance.id}/apply`} className="btn-primary">
                                    Подать заявку
                                </Link>
                            )}
                            {isLeaderOrDeputy && (
                                <Link href={`/alliances/${alliance.id}/applications`} className="btn-secondary">
                                    Заявки
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="alliance-detail-content">
                {/* Posts feed (only for members) */}
                <div className="alliance-feed">
                    <div className="section-header">
                        <h2>Лента альянса</h2>
                        {isMember && (
                            <button className="btn-icon">
                                <IconPlus size={18} />
                            </button>
                        )}
                    </div>

                    {isMember ? (
                        posts.length > 0 ? (
                            <div className="posts-list">
                                {posts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>Пока нет публикаций</p>
                            </div>
                        )
                    ) : (
                        <div className="locked-state">
                            <p>Лента доступна только участникам альянса</p>
                        </div>
                    )}
                </div>

                {/* Members sidebar */}
                <div className="alliance-members-sidebar">
                    <MemberList
                        members={members}
                        currentUserRole={currentMember?.role}
                    />
                </div>
            </div>
        </div>
    );
}
