'use client';

import { useState, useEffect } from 'react';
import { Post, FeedFilters } from '@/lib/types/feed';
import { PostCard, FeedSidebar, CreatePost } from '@/components/feed';
import { useAuth } from '@/lib/auth-context';

// Mock data for demonstration
const mockPosts: Post[] = [
  {
    id: 1,
    authorUsername: 'IDezzan',
    content: 'Добро пожаловать в обновленную ленту Sylvaire! Теперь здесь можно публиковать посты с картинками, ставить лайки и оставлять комментарии.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isAdmin: true,
    likesCount: 12,
    commentsCount: 3,
    alliance: {
      id: 1,
      shortName: 'ADM',
      fullName: 'Администрация',
      color: '#ef4444',
    },
  },
  {
    id: 2,
    authorUsername: 'PlayerOne',
    content: 'Наш альянс ищет новых участников! Мы дружная команда, которая любит строить мега-проекты. Присоединяйтесь!',
    imageUrl: 'https://via.placeholder.com/600x400/1a1a2e/ffffff?text=Minecraft+Build',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    hasSubscription: true,
    likesCount: 8,
    commentsCount: 5,
    alliance: {
      id: 2,
      shortName: 'BLD',
      fullName: 'Builders Guild',
      color: '#3b82f6',
    },
  },
  {
    id: 3,
    authorUsername: 'MinecraftFan',
    content: 'Кто хочет пофармить эндер-жемчуг сегодня вечером? Пишите в дс!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    likesCount: 4,
    commentsCount: 1,
  },
];

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filters, setFilters] = useState<FeedFilters>({
    sort: 'newest',
    period: 'all',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const loadPosts = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setPosts(mockPosts);
      setLoading(false);
    };

    loadPosts();
  }, [filters]);

  const handleCreatePost = async (content: string, imageUrl?: string) => {
    if (!user) return;

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
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                />
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
