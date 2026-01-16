'use client';

import Link from 'next/link';
import { AllianceApplication } from '@/lib/types/alliance';
import { IconCheck, IconX, IconClock, IconUser } from '@/components/ui/icons';
import { useState } from 'react';

interface ApplicationCardProps {
    application: AllianceApplication;
    onAccept?: (id: number) => void;
    onReject?: (id: number, reason: string) => void;
}

export default function ApplicationCard({ application, onAccept, onReject }: ApplicationCardProps) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = () => {
        switch (application.status) {
            case 'PENDING':
                return <span className="status-badge pending"><IconClock size={12} /> На рассмотрении</span>;
            case 'ACCEPTED':
                return <span className="status-badge accepted"><IconCheck size={12} /> Принята</span>;
            case 'REJECTED':
                return <span className="status-badge rejected"><IconX size={12} /> Отклонена</span>;
        }
    };

    const handleAccept = async () => {
        if (!onAccept) return;
        setProcessing(true);
        await onAccept(application.id);
        setProcessing(false);
    };

    const handleReject = async () => {
        if (!onReject || !rejectReason.trim()) return;
        setProcessing(true);
        await onReject(application.id, rejectReason);
        setProcessing(false);
        setShowRejectForm(false);
    };

    return (
        <div className="application-card">
            <div className="application-header">
                <Link href={`/profile/${application.applicantUsername}`} className="applicant-info">
                    <img
                        src={application.applicantAvatarUrl || `https://mc-heads.net/avatar/${application.applicantUsername}/40`}
                        alt={application.applicantUsername}
                        className="applicant-avatar"
                    />
                    <div>
                        <span className="applicant-name">{application.applicantUsername}</span>
                        <span className="application-date">{formatDate(application.createdAt)}</span>
                    </div>
                </Link>
                {getStatusBadge()}
            </div>

            <div className="application-content">
                <div className="application-field">
                    <label>Возраст</label>
                    <p>{application.age} лет</p>
                </div>
                <div className="application-field">
                    <label>Цель вступления</label>
                    <p>{application.purpose}</p>
                </div>
                <div className="application-field">
                    <label>О себе</label>
                    <p>{application.about}</p>
                </div>
            </div>

            {/* Rejection reason (if rejected) */}
            {application.status === 'REJECTED' && application.rejectionReason && (
                <div className="rejection-reason">
                    <label>Причина отклонения</label>
                    <p>{application.rejectionReason}</p>
                </div>
            )}

            {/* Actions (only for pending applications) */}
            {application.status === 'PENDING' && onAccept && onReject && (
                <div className="application-actions">
                    {showRejectForm ? (
                        <div className="reject-form">
                            <textarea
                                placeholder="Укажите причину отклонения..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={2}
                            />
                            <div className="reject-form-actions">
                                <button
                                    className="btn-secondary btn-sm"
                                    onClick={() => setShowRejectForm(false)}
                                    disabled={processing}
                                >
                                    Отмена
                                </button>
                                <button
                                    className="btn-danger btn-sm"
                                    onClick={handleReject}
                                    disabled={processing || !rejectReason.trim()}
                                >
                                    Отклонить
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                className="btn-danger btn-sm"
                                onClick={() => setShowRejectForm(true)}
                                disabled={processing}
                            >
                                <IconX size={16} />
                                Отклонить
                            </button>
                            <button
                                className="btn-success btn-sm"
                                onClick={handleAccept}
                                disabled={processing}
                            >
                                <IconCheck size={16} />
                                Принять
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
