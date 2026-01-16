'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { IconImage, IconX, IconSend } from '@/components/ui/icons';

interface CreatePostProps {
    onSubmit: (content: string, imageUrl?: string) => void;
}

export default function CreatePost({ onSubmit }: CreatePostProps) {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        await onSubmit(content, imagePreview || undefined);
        setContent('');
        setImagePreview(null);
        setIsSubmitting(false);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    return (
        <div className="create-post">
            <div className="create-post-header">
                <img
                    src={`https://mc-heads.net/avatar/${user.username}/48`}
                    alt={user.username}
                    className="create-post-avatar"
                />
                <span className="create-post-username">{user.username}</span>
            </div>

            <form className="create-post-form" onSubmit={handleSubmit}>
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextareaChange}
                    placeholder="Что нового?"
                    maxLength={2000}
                    className="create-post-textarea"
                    rows={3}
                />

                {imagePreview && (
                    <div className="create-post-image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => setImagePreview(null)}
                        >
                            <IconX size={16} />
                        </button>
                    </div>
                )}

                <div className="create-post-footer">
                    <div className="create-post-actions">
                        <label className="create-post-action-btn">
                            <IconImage size={20} />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                hidden
                            />
                        </label>
                    </div>

                    <div className="create-post-submit-area">
                        <span className={`char-count ${content.length > 1800 ? 'warning' : ''} ${content.length > 1950 ? 'danger' : ''}`}>
                            {content.length}/2000
                        </span>
                        <button
                            type="submit"
                            className="create-post-submit"
                            disabled={!content.trim() || isSubmitting}
                        >
                            <IconSend size={18} />
                            {isSubmitting ? 'Публикация...' : 'Опубликовать'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
