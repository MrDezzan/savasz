'use client';

import { useState, useEffect } from 'react';
import { Post, FeedFilters } from '@/lib/types/feed';
import { config } from '@/lib/config';
import { PostCard, FeedSidebar, CreatePost } from '@/components/feed';
import { useAuth } from '@/lib/auth-context';
import { IconTrash } from '@/components/ui/icons';
import { getFeed, createPost as createPostApi, deletePost, toggleLike, createComment, FeedPost, uploadImage } from '@/lib/api';
import { toast } from 'sonner';

export default function ForumPage() {
    const { user, isAdmin, userTags } = useAuth();
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
                // Pass token if user is logged in
                const token = localStorage.getItem('sylvaire_token');
                const data = await getFeed(0, token || undefined);
                console.log('[Forum] getFeed response:', data);
                // Convert FeedPost to Post format
                const convertedPosts: Post[] = data.posts.map((p: FeedPost) => ({
                    id: p.id,
                    authorUsername: p.authorUsername,
                    content: p.content,
                    createdAt: p.createdAt,
                    likesCount: p.likesCount,
                    commentsCount: p.commentsCount,
                    isAdmin: p.isAdmin,
                    hasSubscription: p.hasSubscription,
                    isLikedByMe: p.isLiked,
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
    }, [filters, user]); // Reload when user changes (login/logout) to update isLikedByMe

    const handleCreatePost = async (content: string, imageUrl?: string) => {
        if (!user) return;

        const token = localStorage.getItem('sylvaire_token');
        if (!token) {
            console.error('[Forum] No auth token found');
            return;
        }

        try {
            console.log('[Forum] Creating post with token:', token.substring(0, 20) + '...');
            console.log('[Forum] Creating post with token:', token.substring(0, 20) + '...');

            let finalContent = content;
            let finalImageUrl = undefined; // Don't send base64 to createPostApi

            if (imageUrl) {
                try {
                    // Convert base64 to blob to upload
                    const res = await fetch(imageUrl);
                    const blob = await res.blob();
                    const file = new File([blob], "image.png", { type: blob.type });

                    const uploadRes = await uploadImage(file, token);
                    if (uploadRes.success && uploadRes.url) {
                        // Check if content already has image markdown (unlikely)
                        // Append image at the end
                        finalContent += `\n\n![Image](${config.apiUrl}${uploadRes.url})`;
                    } else {
                        toast.error("Не удалось загрузить изображение: " + uploadRes.error);
                        return;
                    }
                } catch (e) {
                    console.error("Image upload error:", e);
                    toast.error("Ошибка загрузки изображения");
                    return;
                }
            }

            const result = await createPostApi(finalContent, token, finalImageUrl);
            console.log('[Forum] createPost response:', result);
            if (result.success && result.postId) {
                // Add new post to the top
                const newPost: Post = {
                    id: result.postId,
                    authorUsername: user.username,
                    content,
                    imageUrl,
                    createdAt: new Date().toISOString(), // This might still issue a local time, but backend will fix on refresh
                    likesCount: 0,
                    commentsCount: 0,
                    isLikedByMe: false,
                };
                setPosts(prev => [newPost, ...prev]);
                console.log('[Forum] Post added locally, ID:', result.postId);
                toast.success('Публикация создана');
            } else {
                console.error('[Forum] API returned error:', result.error);
                if (result.error === "Banned users cannot post") {
                    toast.error("Вы заблокированы и не можете писать сообщения");
                } else {
                    toast.error('Ошибка: ' + (result.error || 'Не удалось создать публикацию'));
                }
            }
        } catch (error) {
            console.error('[Forum] Failed to create post:', error);
            toast.error('Ошибка соединения с сервером');
        }
    };

    const handleLike = async (postId: number) => {
        if (!user) return;
        const token = localStorage.getItem('sylvaire_token');
        if (!token) return;

        // Optimistic update
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    isLikedByMe: !p.isLikedByMe,
                    likesCount: p.isLikedByMe ? p.likesCount - 1 : p.likesCount + 1
                };
            }
            return p;
        }));

        try {
            await toggleLike(postId, token);
        } catch (error) {
            console.error('Failed to toggle like:', error);
            // Revert on error
            setPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    return {
                        ...p,
                        isLikedByMe: !p.isLikedByMe,
                        likesCount: p.isLikedByMe ? p.likesCount - 1 : p.likesCount + 1
                    };
                }
                return p;
            }));
            toast.error('Не удалось поставить лайк');
        }
    };

    const handleComment = async (postId: number, content: string) => {
        if (!user) return;
        const token = localStorage.getItem('sylvaire_token');
        if (!token) return;

        try {
            const result = await createComment(postId, content, token);
            if (result.success) {
                // Update specific post comment count locally
                setPosts(prev => prev.map(p => {
                    if (p.id === postId) {
                        return {
                            ...p,
                            commentsCount: p.commentsCount + 1
                        };
                    }
                    return p;
                }));
                // Note: PostCard handles displaying the new comment in its internal state usually,
                // but updating the feed count is good practice.
            } else {
                if (result.error && result.error.includes("Вы заблокированы")) {
                    toast.error(result.error);
                } else {
                    toast.error('Не удалось отправить комментарий');
                }
            }
        } catch (error) {
            console.error('Failed to comment:', error);
            toast.error('Ошибка соединения');
        }
    };

    const handleDeletePost = async (postId: number) => {
        if (!isAdmin) return;

        const token = localStorage.getItem('sylvaire_token');
        if (!token) return;

        try {
            const result = await deletePost(postId, token);
            if (result.success) {
                setPosts(prev => prev.filter(p => p.id !== postId));
                toast.success('Публикация удалена');
            } else {
                toast.error('Ошибка: ' + (result.error || 'Не удалось удалить публикацию'));
            }
        } catch (error) {
            console.error('[Forum] Failed to delete post:', error);
            toast.error('Ошибка удаления');
        }
    };

    return (
        <div className="feed-page">
            <div className="feed-layout">
                {/* Main feed */}
                <div className="feed-main">
                    <h1 className="feed-title">Лента</h1>

                    {/* Create post (only for authenticated users) */}
                    {user && (
                        userTags?.isBanned ? (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center mb-8 backdrop-blur-sm">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-red-500 mb-2">Доступ ограничен</h3>
                                <p className="text-white/60 max-w-md mx-auto">
                                    Ваш аккаунт заблокирован, поэтому вы не можете создавать новые публикации и оставлять комментарии.
                                </p>
                                {userTags.subscriptionExpires && (
                                    <p className="text-white/40 text-sm mt-4">
                                        Истекает: {userTags.subscriptionExpires}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <CreatePost onSubmit={handleCreatePost} />
                        )
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
                                        onDelete={handleDeletePost}
                                    />
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
