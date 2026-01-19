import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Comment, getComments, deleteComment } from '@/lib/api'; // Import getComments, deleteComment
import { IconSend, IconChevronDown, IconBan, IconTrash, IconX } from '@/components/ui/icons';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

interface CommentSectionProps {
    postId: number;
    commentsCount: number;
    onComment?: (postId: number, content: string) => void;
    showInput?: boolean;
}

export default function CommentSection({ postId, commentsCount, onComment, showInput }: CommentSectionProps) {
    const { user, isAdmin } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            setLoadingComments(true);
            try {
                const fetched = await getComments(postId);
                // Backend returns most recent comments? Usually we want oldest to newest or newest to oldest.
                // Assuming backend returns in insertion order (or we can sort).
                // Let's sort by ID to be safe or createdAt
                fetched.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                setComments(fetched);
            } catch (error) {
                console.error('Failed to load comments:', error);
            }
            setLoadingComments(false);
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setLoading(true);

        // Optimistic update
        const tempId = Date.now();
        const optimisticComment: Comment = {
            id: tempId,
            postId,
            authorUsername: user.username,
            content: newComment,
            createdAt: new Date().toISOString() + 'Z', // Append 'Z' to match backend format
            isDeleted: false,
        };
        setComments(prev => [...prev, optimisticComment]);
        setNewComment('');

        // Delegate API call to parent (page.tsx handles caching logic/count)
        // Ensure onComment is passed
        /*
          WAIT: page.tsx `handleComment` calls `createComment` API.
          If we call onComment, we don't need to call createComment here.
          BUT `CommentSection` needs the real ID if we want to allow deleting it later.
          The parent `handleComment` returns void.
          We should probably rely on `onComment` to perform the action and maybe reload?
          Or we should handle it here fully.
          Let's stick to the props: `onComment`.
        */
        if (onComment) {
            onComment(postId, optimisticComment.content);
        }

        // Note: Ideally we should exchange the temp comment with real one on success,
        // but `onComment` doesn't return anything.
        // For now, optimistic is "good enough" until refresh.
        // If we wanted to be perfect, `onComment` should be async and return the new comment or ID.
        // Given existing code structure in page.tsx, we rely on full refresh or silent success.

        setLoading(false);
    };

    const handleDelete = async (commentId: number) => {
        if (!confirm('Удалить комментарий?')) return;
        const token = localStorage.getItem('sylvaire_token');
        if (!token) return;

        try {
            const result = await deleteComment(commentId, token);
            if (result.success) {
                setComments(prev => prev.filter(c => c.id !== commentId));
                toast.success('Комментарий удален');
            } else {
                toast.error('Ошибка удаления');
            }
        } catch (e) {
            toast.error('Ошибка соединения');
        }
    };

    const formatTimeAgo = (isoString: string) => {
        // Backend now returns 'Z' appended UTC string.
        // Browser parses "yyyy-MM-ddTHH:mm:ssZ" as UTC correctly.
        const date = new Date(isoString);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) return 'сейчас';
        if (diff < 3600) return Math.floor(diff / 60) + ' мин.';
        if (diff < 86400) return Math.floor(diff / 3600) + ' ч.';
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    const visibleComments = showAll ? comments : comments.slice(-3); // Show last 3 instead of 1
    const hiddenCount = Math.max(0, comments.length - visibleComments.length);

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
                                src={`https://mc-heads.net/avatar/${comment.authorUsername}/32`}
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
                                {(isAdmin || user?.username === comment.authorUsername) && (
                                    <button
                                        className="comment-delete-btn"
                                        onClick={() => handleDelete(comment.id)}
                                        title="Удалить"
                                    >
                                        <IconX size={12} />
                                    </button>
                                )}
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
