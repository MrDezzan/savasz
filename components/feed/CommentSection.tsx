'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Comment } from '@/lib/types/feed';
import { IconSend, IconChevronDown, IconBan } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';

interface CommentSectionProps {
    postId: number;
    commentsCount: number;
    onComment?: (postId: number, content: string) => void;
    showInput?: boolean;
}

// Mock comments for now - will be replaced with API calls
const mockComments: Comment[] = [];

export default function CommentSection({ postId, commentsCount, onComment, showInput }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // TODO: Fetch comments from API
        // For now, use mock data
        setComments(mockComments.filter(c => c.postId === postId));
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setLoading(true);

        // TODO: Send to API
        if (onComment) {
            onComment(postId, newComment);
        }

        // Optimistic update
        const newCommentObj: Comment = {
            id: Date.now(),
            postId,
            authorUsername: user.username,
            content: newComment,
            createdAt: new Date().toISOString(),
        };
        setComments(prev => [...prev, newCommentObj]);
        setNewComment('');
        setLoading(false);
    };

    const formatTimeAgo = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'сейчас';
        if (diff < 3600) return Math.floor(diff / 60) + ' мин.';
        if (diff < 86400) return Math.floor(diff / 3600) + ' ч.';
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    const visibleComments = showAll ? comments : comments.slice(-1);
    const hiddenCount = comments.length - 1;

    return (
        <div className="comment-section">
            {/* Show more comments button */}
            {!showAll && hiddenCount > 0 && (
                <button
                    className="show-more-comments"
                    onClick={() => setShowAll(true)}
                >
                    <IconChevronDown size={16} />
                    Показать ещё {hiddenCount} комментариев
                </button>
            )}

            {/* Comments list */}
            <div className="comments-list">
                {visibleComments.map(comment => (
                    <div key={comment.id} className="comment-item">
                        <Link href={`/profile/${comment.authorUsername}`}>
                            <img
                                src={comment.authorAvatarUrl || `https://mc-heads.net/avatar/${comment.authorUsername}/32`}
                                alt={comment.authorUsername}
                                className="comment-avatar"
                            />
                        </Link>
                        <div className="comment-body">
                            <div className="comment-header">
                                <Link
                                    href={`/profile/${comment.authorUsername}`}
                                    className={`comment-author ${comment.isBanned ? 'banned' : ''}`}
                                >
                                    {comment.authorUsername}
                                </Link>
                                {comment.isBanned && <IconBan size={12} className="ban-icon" />}
                                {comment.isAdmin && <span className="role-badge-mini admin">А</span>}
                                {comment.isModerator && !comment.isAdmin && <span className="role-badge-mini mod">М</span>}
                                <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comment input */}
            {showInput && user && (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <img
                        src={`https://mc-heads.net/avatar/${user.username}/32`}
                        alt={user.username}
                        className="comment-avatar"
                    />
                    <input
                        type="text"
                        placeholder="Написать комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        maxLength={500}
                        className="comment-input"
                    />
                    <button
                        type="submit"
                        className="comment-submit"
                        disabled={loading || !newComment.trim()}
                    >
                        <IconSend size={18} />
                    </button>
                </form>
            )}

            {/* Login prompt for non-authenticated users */}
            {showInput && !user && (
                <div className="comment-login-prompt">
                    <Link href="/login">Войдите</Link>, чтобы оставить комментарий
                </div>
            )}
        </div>
    );
}
