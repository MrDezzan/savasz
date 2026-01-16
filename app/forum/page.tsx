'use client';

import { useState, useEffect } from 'react';
import { Post, FeedFilters } from '@/lib/types/feed';
import { PostCard, FeedSidebar, CreatePost } from '@/components/feed';
import { useAuth } from '@/lib/auth-context';
import { IconTrash } from '@/components/ui/icons';
import { getFeed, createPost as createPostApi, FeedPost } from '@/lib/api';

export default function ForumPage() {
    const { user, isAdmin } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [filters, setFilters] = useState<FeedFilters>({
        sort: 'newest',
        period: 'all',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                const data = await getFeed(0);
                console.log('[Forum] getFeed response:', data);
                // Convert FeedPost to Post format
                const convertedPosts: Post[] = data.posts.map((p: FeedPost) => ({
                    id: p.id,
                    authorUsername: p.authorUsername,
                    content: p.content,
                    createdAt: p.createdAt,
                    likesCount: 0,
                    commentsCount: 0,
                    isAdmin: p.isAdmin,
                    hasSubscription: p.hasSubscription,
                }));
                console.log('[Forum] Loaded posts:', convertedPosts.length);
                setPosts(convertedPosts);
            } catch (error) {
                console.error('[Forum] Failed to load posts:', error);
                setPosts([]);
            }
            setLoading(false);
        };

        loadPosts();
    }, [filters]);

    const handleCreatePost = async (content: string, imageUrl?: string) => {
        if (!user) return;

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('[Forum] No auth token found');
            return;
        }

        try {
            console.log('[Forum] Creating post with token:', token.substring(0, 20) + '...');
            const result = await createPostApi(content, token);
            console.log('[Forum] createPost response:', result);
            if (result.success && result.postId) {
                // Add new post to the top
                const newPost: Post = {
                    id: result.postId,
                    authorUsername: user.username,
                    content,
                    imageUrl,
                    createdAt: new Date().toISOString(),
                    likesCount: 0,
                    commentsCount: 0,
                };
                setPosts(prev => [newPost, ...prev]);
                console.log('[Forum] Post added locally, ID:', result.postId);
            } else {
                console.error('[Forum] API returned error:', result.error);
            }
        } catch (error) {
            console.error('[Forum] Failed to create post:', error);
        }
    };

    const handleLike = (postId: number) => {
        // Like API not implemented on backend yet
    };

    const handleComment = (postId: number, content: string) => {
        // Comment API not implemented on backend yet
    };

    const handleDeletePost = async (postId: number) => {
        if (!isAdmin) return;
        // Delete API not implemented on backend yet
        // For now just remove from local state
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
