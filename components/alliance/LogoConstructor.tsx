'use client';

import { useState, useCallback } from 'react';
import { IconX, IconCheck, IconTrash, IconArrowLeft, IconArrowRight } from '@/components/ui/icons';

interface LogoConstructorProps {
    onSave: (svgString: string) => void;
    onCancel: () => void;
    initialSvg?: string;
    error?: string | null;
    isSubmitting?: boolean;
}

// Minecraft-style color palette
const COLORS = [
    '#1a1a2e', '#16213e', '#0f3460', '#e94560', // Dark blues & red
    '#533483', '#7952b3', '#6366f1', '#818cf8', // Purples
    '#10b981', '#34d399', '#fbbf24', '#f59e0b', // Greens & yellows
    '#ef4444', '#f97316', '#ec4899', '#8b5cf6', // Reds & pinks
    '#3b82f6', '#06b6d4', '#14b8a6', '#ffffff', // Blues & white
    '#94a3b8', '#64748b', '#475569', '#000000', // Grays & black
];

const GRID_SIZE = 16;

export default function LogoConstructor({ onSave, onCancel, initialSvg, error, isSubmitting }: LogoConstructorProps) {
    const [grid, setGrid] = useState<(string | null)[][]>(() => {
        // Initialize empty grid
        return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    });
    const [selectedColor, setSelectedColor] = useState(COLORS[6]); // Default: accent blue
    const [isDrawing, setIsDrawing] = useState(false);

    const handleCellClick = (row: number, col: number) => {
        setGrid(prev => {
            const newGrid = prev.map(r => [...r]);
            newGrid[row][col] = newGrid[row][col] === selectedColor ? null : selectedColor;
            return newGrid;
        });
    };

    const handleMouseDown = (row: number, col: number) => {
        setIsDrawing(true);
        handleCellClick(row, col);
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (isDrawing) {
            setGrid(prev => {
                const newGrid = prev.map(r => [...r]);
                newGrid[row][col] = selectedColor;
                return newGrid;
            });
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleClear = () => {
        setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
    };

    const generateSvg = useCallback(() => {
        let paths = '';
        const cellSize = 1;

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const color = grid[row][col];
                if (color) {
                    paths += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}"/>`;
                }
            }
        }

        return `<svg viewBox="0 0 ${GRID_SIZE} ${GRID_SIZE}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
    }, [grid]);

    const handleSave = () => {
        onSave(generateSvg());
    };

    // Check if grid has any content
    const hasContent = grid.some(row => row.some(cell => cell !== null));

    return (
        <div className="logo-constructor-overlay" onMouseUp={handleMouseUp}>
            <div className="logo-constructor">
                <div className="logo-constructor-header">
                    <h2>Конструктор логотипа</h2>
                    <button className="logo-close-btn" onClick={onCancel}>
                        <IconX size={20} />
                    </button>
                </div>

                <div className="logo-constructor-body">
                    {/* Canvas */}
                    <div className="logo-canvas-wrapper">
                        <div
                            className="logo-canvas"
                            style={{
                                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                            }}
                        >
                            {grid.map((row, rowIndex) =>
                                row.map((cell, colIndex) => (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        className={`logo-cell ${cell ? 'filled' : ''}`}
                                        style={{ backgroundColor: cell || 'transparent' }}
                                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div className="logo-palette">
                        <h4>Цвета</h4>
                        <div className="color-grid">
                            {COLORS.map(color => (
                                <button
                                    key={color}
                                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>

                        <div className="current-color">
                            <span>Выбран:</span>
                            <div className="color-preview" style={{ backgroundColor: selectedColor }} />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="logo-preview">
                        <h4>Предпросмотр</h4>
                        <div className="preview-sizes">
                            <div
                                className="preview-item large"
                                dangerouslySetInnerHTML={{ __html: generateSvg() }}
                            />
                            <div
                                className="preview-item medium"
                                dangerouslySetInnerHTML={{ __html: generateSvg() }}
                            />
                            <div
                                className="preview-item small"
                                dangerouslySetInnerHTML={{ __html: generateSvg() }}
                            />
                        </div>
                    </div>
                </div>

                <div className="logo-constructor-footer">
                    {error && (
                        <div className="logo-error-message" style={{ color: '#ef4444', marginBottom: '10px', fontSize: '14px', textAlign: 'center', width: '100%' }}>
                            {error}
                        </div>
                    )}
                    <button className="logo-btn secondary" onClick={handleClear} disabled={isSubmitting}>
                        <IconTrash size={16} />
                        Очистить
                    </button>
                    <div className="footer-right">
                        <button className="logo-btn secondary" onClick={onCancel} disabled={isSubmitting}>
                            Отмена
                        </button>
                        <button
                            className="logo-btn primary"
                            onClick={handleSave}
                            disabled={!hasContent || isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="loading-spinner-wrapper" style={{ marginRight: '8px' }}>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            ) : (
                                <IconCheck size={16} />
                            )}
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
