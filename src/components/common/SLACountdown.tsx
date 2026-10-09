import React from 'react';
import { Ticket } from '../../types';
import { Clock, AlertTriangle, CheckCircle2, PauseCircle } from 'lucide-react';

interface SLACountdownProps {
  ticket: Ticket;
  showIcon?: boolean;
}

export const SLACountdown: React.FC<SLACountdownProps> = ({ ticket, showIcon = true }) => {
  if (ticket.status === 'resolved' || ticket.status === 'closed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        {showIcon && <CheckCircle2 className="w-3.5 h-3.5" />}
        <span>Đúng hạn SLA</span>
      </span>
    );
  }

  if (ticket.slaPaused) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
        {showIcon && <PauseCircle className="w-3.5 h-3.5" />}
        <span>Tạm dừng SLA (Chờ NV)</span>
      </span>
    );
  }

  const now = new Date().getTime();
  const deadline = new Date(ticket.slaDeadline).getTime();
  const diffMs = deadline - now;
  const isOverdue = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  let timeString = '';
  if (days > 0) {
    timeString = `${days}d ${remainingHours}h`;
  } else {
    timeString = `${hours}h`;
  }

  if (isOverdue) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 animate-pulse">
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
        <span>Quá SLA {timeString}</span>
      </span>
    );
  }

  // Warning when less than 8 hours left
  if (hours <= 8) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
        {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600" />}
        <span>Gấp: Còn {timeString}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
      {showIcon && <Clock className="w-3.5 h-3.5 text-slate-500" />}
      <span>Còn {timeString}</span>
    </span>
  );
};
