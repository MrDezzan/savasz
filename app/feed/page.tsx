'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { config } from '@/lib/config';
import { useAuth } from '@/lib/auth-context';

// Define types locally since they might not be in api.ts yet or differ
interface FeedPost {
    id: number;
    authorUsername: string;
    content: string;
    createdAt: string;
    isAdmin: boolean;
    isModerator?: boolean;
    hasSubscription: boolean;
}

export default function FeedPage() {
    const { user, userTags, canManageTags } = useAuth();
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [postContent, setPostContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Используем теги из контекста авторизации (синхронизированы с LuckPerms)
    const isAdmin = userTags?.isAdmin || userTags?.isModerator || canManageTags;

    useEffect(() => {
        loadPosts(0);
    }, []);

    // Auth теперь обрабатывается через useAuth hook (см. auth-context.tsx)
    // Теги синхронизируются с LuckPerms при каждом входе

    const loadPosts = async (pageNum: number, append = false) => {
        if (!append) setLoading(true);
        try {
            const res = await fetch(`${config.apiUrl}/api/feed?page=${pageNum}`);
            const data = await res.json();

            if (data.success) {
                if (append) {
                    setPosts(prev => [...prev, ...data.posts]);
                } else {
                    setPosts(data.posts);
                }
                setHasMore(data.hasMore);
            }
        } catch (e) {
            console.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        loadPosts(nextPage, true);
    };

    const handleSubmitPost = async () => {
        if (!user || !postContent.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${config.apiUrl}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ content: postContent })
            });
            const data = await res.json();

            if (data.success) {
                setPostContent('');
                setPage(0);
                loadPosts(0, false);
            } else {
                toast.error(data.error || 'Ошибка публикации');
            }
        } catch (e) {
            toast.error('Ошибка соединения');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!isAdmin || !user) return;
        if (!confirm('Удалить эту публикацию?')) return;

        try {
            const res = await fetch(`${config.apiUrl}/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (res.ok) {
                setPosts(posts.filter(p => p.id !== postId));
            }
        } catch (e) { }
    };

    const formatTimeAgo = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'только что';
        if (diff < 3600) return Math.floor(diff / 60) + ' мин. назад';
        if (diff < 86400) return Math.floor(diff / 3600) + ' ч. назад';
        if (diff < 604800) return Math.floor(diff / 86400) + ' дн. назад';
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    const handleBanUser = () => {
        if (!user) return;
        const username = prompt('Введите никнейм для блокировки:');
        if (!username) return;
        const duration = prompt('Длительность в минутах (пусто = навсегда):');
        const reason = prompt('Причина:');

        fetch(`${config.apiUrl}/api/bans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ username, duration: duration ? parseInt(duration) : null, reason })
        }).then(res => {
            if (res.ok) toast.success('Пользователь заблокирован');
        });
    };

    const handleMuteUser = () => {
        if (!user) return;
        const username = prompt('Введите никнейм для мута:');
        if (!username) return;
        const duration = prompt('Длительность в минутах (пусто = навсегда):');
        const reason = prompt('Причина:');

        fetch(`${config.apiUrl}/api/mutes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ username, duration: duration ? parseInt(duration) : null, reason })
        }).then(res => {
            if (res.ok) toast.success('Пользователь замучен');
        });
    };

    return (
        <section className="feed-page">
            <div className="container">
                <div className="feed-container">
                    <div className="feed-header">
                        <Link href="/" className="back-link" style={{ marginRight: 'auto' }}>← На главную</Link>
                        <h1 className="feed-title">Лента сообщества</h1>
                    </div>

                    {!user ? (
                        <div className="login-prompt">
                            <h3>👋 Присоединяйтесь к обсуждению</h3>
                            <p>Войдите в аккаунт, чтобы публиковать сообщения</p>
                            <Link href="/login" className="btn">Войти через Discord</Link>
                        </div>
                    ) : (
                        <div className="create-post-card">
                            <div className="create-post-header">
                                <div className="user-avatar-small">
                                    <img src={`https://mc-heads.net/avatar/${user.username}/88`} alt={user.username} />
                                </div>
                                <div className="user-info-small">
                                    <span className="user-name-small">{user.username}</span>
                                    {/* Hierarchy: Admin > Mod > Sub */}
                                    {userTags?.isAdmin ? (
                                        <span className="admin-tag">Админ</span>
                                    ) : userTags?.isModerator ? (
                                        <span className="text-tag" style={{ color: '#3498DB', fontWeight: 600, fontSize: '13px' }}>Мод</span>
                                    ) : userTags?.hasSubscription ? (
                                        <span className="sub-tag">+</span>
                                    ) : null}
                                </div>
                            </div>
                            <textarea
                                className="create-textarea"
                                placeholder="Что нового?"
                                maxLength={2000}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                            <div className="create-footer">
                                <span className={`char-count ${postContent.length > 1800 ? 'danger' : postContent.length > 1500 ? 'warning' : ''}`}>
                                    {postContent.length}/2000
                                </span>
                                <button
                                    className="post-btn"
                                    onClick={handleSubmitPost}
                                    disabled={submitting || !postContent.trim()}
                                >
                                    {submitting ? 'Публикация...' : 'Опубликовать'}
                                </button>
                            </div>
                        </div>
                    )}

                    {isAdmin && (
                        <div className="admin-panel visible">
                            <div className="admin-panel-title">◈ Панель модерации</div>
                            <div className="admin-actions">
                                <button className="admin-btn" onClick={handleBanUser}>Заблокировать пользователя</button>
                                <button className="admin-btn" onClick={handleMuteUser}>Замутить пользователя</button>
                            </div>
                        </div>
                    )}

                    <div id="posts-container">
                        {loading && page === 0 ? (
                            <div className="feed-loading">
                                <div className="loading-spinner"></div>
                                <p>Загрузка публикаций...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="feed-empty">
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>◇</div>
                                <h3>Пока нет публикаций</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>Станьте первым, кто опубликует сообщение!</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div className="post-card" key={post.id}>
                                    <div className="post-header">
                                        <div className="post-author">
                                            <Link href={`/profile/${post.authorUsername}`} className="post-avatar">
                                                <img src={`https://mc-heads.net/avatar/${post.authorUsername}/96`} alt={post.authorUsername} />
                                            </Link>
                                            <div className="post-author-info">
                                                <span className="post-author-name">
                                                    <Link href={`/profile/${post.authorUsername}`}>
                                                        {post.authorUsername}
                                                    </Link>
                                                    {/* Hierarchy: Admin > Mod > Sub */}
                                                    {post.isAdmin ? (
                                                        <span className="admin-tag">Админ</span>
                                                    ) : post.isModerator ? (
                                                        <span className="text-tag" style={{ color: '#3498DB', fontWeight: 600, fontSize: '13px', marginLeft: '6px' }}>Мод</span>
                                                    ) : post.hasSubscription ? (
                                                        <span className="sub-tag">+</span>
                                                    ) : null}
                                                </span>
                                                <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <div className="post-actions">
                                                <button className="post-action-btn" onClick={() => handleDeletePost(post.id)}>✕ Удалить</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="post-content">{post.content}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {hasMore && !loading && (
                        <button className="load-more-btn" onClick={handleLoadMore}>
                            Загрузить ещё
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
