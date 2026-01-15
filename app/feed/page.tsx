'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getFeed, createPost, validateSession, type FeedPost } from '@/lib/api';
import { formatTimeAgo } from '@/lib/utils';

export default function FeedPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ username: string; token: string } | null>(null);
    const [newPost, setNewPost] = useState('');
    const [posting, setPosting] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        // Check auth
        const token = localStorage.getItem('sylvaire_token');
        const username = localStorage.getItem('sylvaire_username');

        if (token && username) {
            validateSession(token).then((data) => {
                if (data.valid) {
                    setUser({ username: data.username || username, token });
                }
            });
        }

        // Load posts
        loadPosts(0);
    }, []);

    const loadPosts = async (pageNum: number, append = false) => {
        setLoading(true);
        try {
            const data = await getFeed(pageNum);
            if (append) {
                setPosts((prev) => [...prev, ...data.posts]);
            } else {
                setPosts(data.posts);
            }
            setHasMore(data.hasMore);
            setPage(pageNum);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newPost.trim() || posting) return;

        setPosting(true);
        const result = await createPost(newPost.trim(), user.token);

        if (result.success) {
            setNewPost('');
            loadPosts(0);
        } else {
            alert(result.error || 'Ошибка публикации');
        }
        setPosting(false);
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold text-center mb-2">💬 Лента сообщества</h1>
                <p className="text-slate-400 text-center mb-8">Что нового в Sylvaire</p>

                {/* Create Post */}
                {user ? (
                    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <img
                                src={`https://mc-heads.net/avatar/${user.username}/48`}
                                alt=""
                                className="w-12 h-12 rounded-xl"
                            />
                            <div className="flex-1">
                                <textarea
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="Что нового?"
                                    maxLength={2000}
                                    className="w-full min-h-[100px] bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 resize-none focus:border-indigo-500 focus:outline-none"
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <span className={`text-sm ${newPost.length > 1800 ? 'text-red-400' : 'text-slate-500'}`}>
                                        {newPost.length}/2000
                                    </span>
                                    <button
                                        type="submit"
                                        disabled={!newPost.trim() || posting}
                                        className="btn-primary px-6 py-2 disabled:opacity-50"
                                    >
                                        {posting ? 'Публикация...' : 'Опубликовать'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="glass rounded-2xl p-8 text-center mb-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Присоединяйтесь к обсуждению</h3>
                        <p className="text-slate-400 mb-4">Войдите, чтобы публиковать сообщения</p>
                        <Link href="/login" className="btn-primary inline-block">
                            Войти через Discord
                        </Link>
                    </div>
                )}

                {/* Posts */}
                <div className="space-y-4">
                    {loading && posts.length === 0 ? (
                        <div className="flex justify-center py-12">
                            <div className="loading-spinner" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="glass rounded-2xl p-12 text-center">
                            <p className="text-4xl mb-4">📝</p>
                            <h3 className="text-xl font-semibold text-white mb-2">Пока нет публикаций</h3>
                            <p className="text-slate-400">Станьте первым!</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <article key={post.id} className="glass rounded-2xl p-6 animate-fade-in">
                                <div className="flex items-start gap-4">
                                    <Link href={`/profile/${post.authorUsername}`}>
                                        <img
                                            src={`https://mc-heads.net/avatar/${post.authorUsername}/48`}
                                            alt=""
                                            className="w-12 h-12 rounded-xl hover:scale-105 transition-transform"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link
                                                href={`/profile/${post.authorUsername}`}
                                                className="font-semibold text-white hover:text-indigo-400 transition-colors"
                                            >
                                                {post.authorUsername}
                                            </Link>
                                            {post.isAdmin && (
                                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                                    Админ
                                                </span>
                                            )}
                                            {post.hasSubscription && (
                                                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                                                    +
                                                </span>
                                            )}
                                            <span className="text-slate-500 text-sm">
                                                · {formatTimeAgo(post.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-slate-300 whitespace-pre-wrap break-words">
                                            {post.content}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* Load More */}
                {hasMore && (
                    <button
                        onClick={() => loadPosts(page + 1, true)}
                        disabled={loading}
                        className="w-full mt-6 py-4 glass rounded-xl text-slate-400 hover:text-white transition-colors"
                    >
                        {loading ? 'Загрузка...' : 'Загрузить ещё'}
                    </button>
                )}
            </div>
        </div>
    );
}
