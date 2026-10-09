import React from 'react';
import { TicketPriority } from '../../types';

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const configs: Record<
    TicketPriority,
    { label: string; bg: string; text: string; dot: string }
  > = {
    low: {
      label: 'Thấp',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
    },
    medium: {
      label: 'Trung bình',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
    },
    high: {
      label: 'Cao',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-500',
    },
    urgent: {
      label: 'Khẩn cấp',
      bg: 'bg-red-50',
      text: 'text-red-700',
      dot: 'bg-red-600 animate-pulse',
    },
  };

  const config = configs[priority] || configs.medium;

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} ${config.text} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
