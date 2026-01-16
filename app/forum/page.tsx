'use client';

import { useState, useEffect } from 'react';
import { Post, FeedFilters } from '@/lib/types/feed';
import { PostCard, FeedSidebar, CreatePost } from '@/components/feed';
import { useAuth } from '@/lib/auth-context';
import { IconTrash } from '@/components/ui/icons';

export default function ForumPage() {
    const { user, isAdmin } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [filters, setFilters] = useState<FeedFilters>({
        sort: 'newest',
        period: 'all',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call - fetch posts from backend
        const loadPosts = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 300));
            // Posts will be loaded from API
            setPosts([]);
            setLoading(false);
        };

        loadPosts();
    }, [filters]);

    const handleCreatePost = async (content: string, imageUrl?: string) => {
        if (!user) return;

        // TODO: Send to API
        const newPost: Post = {
            id: Date.now(),
            authorUsername: user.username,
            content,
            imageUrl,
            createdAt: new Date().toISOString(),
            likesCount: 0,
            commentsCount: 0,
        };

        setPosts(prev => [newPost, ...prev]);
    };

    const handleLike = (postId: number) => {
        // TODO: Send like to API
        console.log('Like post:', postId);
    };

    const handleComment = (postId: number, content: string) => {
        // TODO: Send comment to API
        console.log('Comment on post:', postId, content);
    };

    const handleDeletePost = async (postId: number) => {
        if (!isAdmin) return;
        // TODO: Send delete to API
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    return (
        <div className="feed-page">
            <div className="feed-layout">
                {/* Main feed */}
                <div className="feed-main">
                    <h1 className="feed-title">Лента</h1>

                    {/* Create post (only for authenticated users) */}
                    {user && (
                        <CreatePost onSubmit={handleCreatePost} />
                    )}

                    {/* Posts */}
                    <div className="posts-list">
                        {loading ? (
                            <div className="feed-loading">
                                <div className="loading-spinner" />
                                <p>Загрузка ленты...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="feed-empty">
                                <div className="feed-empty-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <h3>Пока нет публикаций</h3>
                                <p>Станьте первым, кто опубликует сообщение!</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} className="post-wrapper">
                                    <PostCard
                                        post={post}
                                        onLike={handleLike}
                                        onComment={handleComment}
                                    />
                                    {/* Admin delete button */}
                                    {isAdmin && (
                                        <button
                                            className="admin-delete-btn"
                                            onClick={() => handleDeletePost(post.id)}
                                            title="Удалить публикацию"
                                        >
                                            <IconTrash size={16} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <FeedSidebar
                    filters={filters}
                    onFiltersChange={setFilters}
                />
            </div>
        </div>
    );
}
