'use client';

import { FeedFilters } from '@/lib/types/feed';
import { IconFilter, IconClock, IconSort } from '@/components/ui/icons';

interface FeedSidebarProps {
    filters: FeedFilters;
    onFiltersChange: (filters: FeedFilters) => void;
}

export default function FeedSidebar({ filters, onFiltersChange }: FeedSidebarProps) {
    return (
        <aside className="feed-sidebar">
            <div className="feed-sidebar-card">
                <h3 className="feed-sidebar-title">
                    <IconFilter size={18} />
                    Фильтры
                </h3>

                {/* Sort */}
                <div className="filter-group">
                    <label className="filter-label">
                        <IconSort size={16} />
                        Сортировка
                    </label>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filters.sort === 'newest' ? 'active' : ''}`}
                            onClick={() => onFiltersChange({ ...filters, sort: 'newest' })}
                        >
                            Новые
                        </button>
                        <button
                            className={`filter-btn ${filters.sort === 'popular' ? 'active' : ''}`}
                            onClick={() => onFiltersChange({ ...filters, sort: 'popular' })}
                        >
                            Популярные
                        </button>
                    </div>
                </div>

                {/* Period */}
                <div className="filter-group">
                    <label className="filter-label">
                        <IconClock size={16} />
                        Период
                    </label>
                    <div className="filter-buttons filter-buttons-grid">
                        <button
                            className={`filter-btn ${filters.period === 'day' ? 'active' : ''}`}
                            onClick={() => onFiltersChange({ ...filters, period: 'day' })}
                        >
                            День
                        </button>
                        <button
                            className={`filter-btn ${filters.period === 'week' ? 'active' : ''}`}
                            onClick={() => onFiltersChange({ ...filters, period: 'week' })}
                        >
                            Неделя
                        </button>
                        <button
                            className={`filter-btn ${filters.period === 'month' ? 'active' : ''}`}
                            onClick={() => onFiltersChange({ ...filters, period: 'month' })}
                        >
                            Месяц
                        </button>
                        <button
                            className={`filter-btn ${filters.period === 'all' ? 'active' : ''}`}
                            onClick={() => onFiltersChange({ ...filters, period: 'all' })}
                        >
                            Всё время
                        </button>
                    </div>
                </div>
            </div>

            {/* Info card */}
            <div className="feed-sidebar-card feed-info-card">
                <h3 className="feed-sidebar-title">Лента Sylvaire</h3>
                <p className="feed-info-text">
                    Публикации игроков и альянсов. Делитесь новостями,
                    обсуждайте события и находите единомышленников.
                </p>
            </div>
        </aside>
    );
}
