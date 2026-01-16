'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ToastOptions {
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

// Toast hook для удобного вызова
export function useToast() {
    const showToast = (message: string, options: ToastOptions = {}) => {
        const { type = 'info', duration = 4000 } = options;

        switch (type) {
            case 'success':
                toast.success(message, { duration });
                break;
            case 'error':
                toast.error(message, { duration });
                break;
            case 'warning':
                toast.warning(message, { duration });
                break;
            default:
                toast.info(message, { duration });
        }
    };

    return { showToast };
}

// Простой компонент Toast для кастомных уведомлений (если нужен)
interface CustomToastProps {
    title: string;
    message?: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    onClose?: () => void;
}

export default function CustomToast({ title, message, type = 'info', onClose }: CustomToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    return (
        <div className={`custom-toast custom-toast-${type}`}>
            <div className="custom-toast-content">
                <h4 className="custom-toast-title">{title}</h4>
                {message && <p className="custom-toast-message">{message}</p>}
            </div>
            <button className="custom-toast-close" onClick={() => { setIsVisible(false); onClose?.(); }}>
                &times;
            </button>
        </div>
    );
}
