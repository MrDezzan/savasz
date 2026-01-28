'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types/feed';
import { IconHeart, IconHeartFilled, IconComment, IconMoreHorizontal, IconCrown, IconBan, IconTrash } from '@/components/ui/icons';
import CommentSection from './CommentSection';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useRef } from 'react';

interface PostCardProps {
    post: Post;
    onLike?: (postId: number) => void;
    onComment?: (postId: number, content: string) => void;
    onDelete?: (postId: number) => void;
    showComments?: boolean;
}

import { toast } from 'sonner';

export default function PostCard({ post, onLike, onComment, onDelete, showComments = true }: PostCardProps) {
    const { isAdmin, user } = useAuth();
    const [isLiked, setIsLiked] = useState(post.isLikedByMe || false);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    // ... rest of state

    // ... useEffect ...

    const handleLike = () => {
        if (!user) {
            toast.error('Войдите в аккаунт, чтобы оценить');
            return;
        }
        if (onLike) {
            onLike(post.id);
        }
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const formatTimeAgo = (isoString: string) => {
        // Backend returns time without timezone (e.g., "2026-01-16T14:30:00")
        // Server is in UTC+5, so append timezone if not present
        let dateStr = isoString;
        if (isoString.includes('T') && !isoString.includes('Z') && !isoString.includes('+') && !isoString.includes('-', 10)) {
            dateStr = isoString + '+05:00';
        }

        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 0) return 'только что';
        if (diff < 60) return 'только что';
        if (diff < 3600) return Math.floor(diff / 60) + ' мин.';
        if (diff < 86400) return Math.floor(diff / 3600) + ' ч.';
        if (diff < 604800) return Math.floor(diff / 86400) + ' дн.';
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    const renderContent = (content: string) => {
        // Regex to match markdown images: ![alt](url)
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = imageRegex.exec(content)) !== null) {
            // Text before image
            if (match.index > lastIndex) {
                parts.push(content.slice(lastIndex, match.index));
            }

            // The image itself
            const alt = match[1];
            const src = match[2];
            parts.push(
                <div key={match.index} className="post-image-container my-2">
                    <img src={src} alt={alt} className="rounded-lg max-h-96 object-contain" />
                </div>
            );

            lastIndex = match.index + match[0].length;
        }

        // Remaining text
        if (lastIndex < content.length) {
            parts.push(content.slice(lastIndex));
        }

        // If no images found, return content as lines
        if (parts.length === 0) {
            return content.split('\n').map((line, i) => (
                <span key={i}>
                    {line}
                    <br />
                </span>
            ));
        }

        return parts.map((part, i) => {
            if (typeof part === 'string') {
                return part.split('\n').map((line, j) => (
                    <span key={`${i}-${j}`}>
                        {line}
                        <br />
                    </span>
                ));
            }
            return part;
        });
    };

    return (
        <article className="post-card">
            {/* Header */}
            <div className="post-header">
                <Link href={`/profile/${post.authorUsername}`} className="post-author">
                    <img
                        src={post.authorAvatarUrl || `https://mc-heads.net/avatar/${post.authorUsername}/48`}
                        alt={post.authorUsername}
                        className="post-avatar"
                    />
                    <div className="post-author-info">
                        <div className="post-author-name-row">
                            <span className={`post-author-name ${post.isBanned ? 'banned' : ''}`}>
                                {post.authorUsername}
                            </span>
                            {post.isBanned && (
                                <span className="ban-badge" title="Забанен">
                                    <IconBan size={12} />
                                </span>
                            )}
                            {post.isAdmin && <span className="role-badge admin">Админ</span>}
                            {post.isModerator && !post.isAdmin && <span className="role-badge mod">Мод</span>}
                            {post.hasSubscription && !post.isAdmin && !post.isModerator && (
                                <span className="role-badge sub">+</span>
                            )}
                        </div>
                        {post.alliance && (
                            <Link
                                href={`/alliances/${post.alliance.id}`}
                                className="post-alliance-badge"
                                style={{ color: post.alliance.color }}
                            >
                                {post.alliance.logoSvg && (
                                    <span
                                        className="alliance-logo-mini"
                                        dangerouslySetInnerHTML={{ __html: post.alliance.logoSvg }}
                                    />
                                )}
                                {post.alliance.shortName}
                            </Link>
                        )}
                    </div>
                </Link>
                <div className="post-meta">
                    <span className="post-time">{formatTimeAgo(post.createdAt)}</span>
                    <div className="post-menu-container" ref={menuRef}>
                        <button
                            className="post-menu-btn"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <IconMoreHorizontal size={18} />
                        </button>
                        {showMenu && (
                            <div className="post-menu-dropdown">
                                {isAdmin && onDelete && (
                                    <button
                                        className="post-menu-item delete"
                                        onClick={() => {
                                            if (confirm('Вы уверены, что хотите удалить эту публикацию?')) {
                                                onDelete(post.id);
                                            }
                                            setShowMenu(false);
                                        }}
                                    >
                                        <IconTrash size={16} />
                                        <span>Удалить</span>
                                    </button>
                                )}
                                {!isAdmin && (
                                    <div className="post-menu-item disabled">Нет действий</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="post-content">
                <div className="text-gray-100 whitespace-pre-wrap">
                    {renderContent(post.content)}
                </div>
                {post.imageUrl && !post.content.includes(post.imageUrl) && (
                    <div className="post-image">
                        <img src={post.imageUrl} alt="" />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="post-actions">
                <button
                    className={`post-action-btn ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                    <span>{likesCount}</span>
                </button>
                <button
                    className="post-action-btn"
                    onClick={() => setShowCommentInput(!showCommentInput)}
                >
                    <IconComment size={20} />
                    <span>{post.commentsCount}</span>
                </button>
            </div>

            {/* Comments */}
            {showComments && (showCommentInput || post.commentsCount > 0) && (
                <CommentSection
                    postId={post.id}
                    commentsCount={post.commentsCount}
                    onComment={onComment}
                    showInput={showCommentInput}
                />
            )}
        </article>
    );
}
