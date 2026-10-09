import React from 'react';
import { TicketStatus } from '../../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileEdit,
  Send,
  Eye,
  ArrowUpRight,
  Archive,
  RefreshCcw,
} from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<
    TicketStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    draft: {
      label: 'Nháp',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: <FileEdit className="w-3.5 h-3.5" />,
    },
    submitted: {
      label: 'Đã gửi',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <Send className="w-3.5 h-3.5" />,
    },
    in_review: {
      label: 'Đang xem xét',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    need_info: {
      label: 'Cần bổ sung',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-300',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    in_progress: {
      label: 'Đang xử lý',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <Clock className="w-3.5 h-3.5 animate-spin-slow" />,
    },
    pending_approval: {
      label: 'Chờ phê duyệt',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    escalated: {
      label: 'Chuyển cấp trên',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300',
      icon: <ArrowUpRight className="w-3.5 h-3.5" />,
    },
    resolved: {
      label: 'Đã hoàn thành',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    closed: {
      label: 'Đã đóng',
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      icon: <Archive className="w-3.5 h-3.5" />,
    },
    reopened: {
      label: 'Mở lại xử lý',
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: <RefreshCcw className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs.submitted;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
