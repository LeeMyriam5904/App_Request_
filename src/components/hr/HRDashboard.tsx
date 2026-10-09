import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { SLACountdown } from '../common/SLACountdown';
import {
  Inbox,
  Clock,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Layers,
  Sparkles,
} from 'lucide-react';

export const HRDashboard: React.FC = () => {
  const { tickets, selectTicket, setActiveTab, setFilterStatus } = useApp();

  const now = new Date().getTime();

  // 1. New Tickets (Submitted or unassigned)
  const newTickets = tickets.filter(
    (t) => t.status === 'submitted' || (!t.assigneeId && t.status !== 'closed' && t.status !== 'resolved')
  );

  // 2. In Progress
  const inProgressTickets = tickets.filter(
    (t) => t.status === 'in_progress' || t.status === 'in_review'
  );

  // 3. Near SLA Breach (< 8 hours left and not resolved/closed)
  const nearSlaTickets = tickets.filter((t) => {
    if (t.status === 'resolved' || t.status === 'closed' || t.slaPaused) return false;
    const deadline = new Date(t.slaDeadline).getTime();
    const diffHours = (deadline - now) / (1000 * 3600);
    return diffHours >= 0 && diffHours <= 8;
  });

  // 4. Overdue SLA
  const overdueTickets = tickets.filter((t) => {
    if (t.status === 'resolved' || t.status === 'closed') return false;
    const deadline = new Date(t.slaDeadline).getTime();
    return deadline < now;
  });

  // SLA Compliance rate
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed');
  const onTimeResolved = resolvedTickets.filter((t) => {
    if (!t.resolvedAt) return true;
    return new Date(t.resolvedAt).getTime() <= new Date(t.slaDeadline).getTime();
  });
  const slaComplianceRate =
    resolvedTickets.length > 0 ? Math.round((onTimeResolved.length / resolvedTickets.length) * 100) : 92;

  // Recent tickets needing attention
  const urgentQueue = tickets
    .filter((t) => t.status !== 'closed' && t.status !== 'resolved')
    .sort((a, b) => new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bàn làm việc HR Specialist (Workspace)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi khối lượng công việc, cảnh báo SLA và xử lý yêu cầu dịch vụ Nhân sự
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hr_tickets')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
          >
            Quản lý toàn bộ tickets
          </button>
          <button
            onClick={() => setActiveTab('hr_kanban')}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold"
          >
            Bảng Kanban
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Ticket mới */}
        <div
          onClick={() => {
            setFilterStatus('submitted');
            setActiveTab('hr_tickets');
          }}
          className="p-5 rounded-2xl bg-white border border-blue-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all border-l-4 border-l-blue-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Mới</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{newTickets.length}</span>
            <span className="text-xs text-blue-600 font-semibold">Cần tiếp nhận</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Chưa được xử lý hoặc phân công</p>
        </div>

        {/* Card 2: Đang xử lý */}
        <div
          onClick={() => {
            setFilterStatus('in_progress');
            setActiveTab('hr_tickets');
          }}
          className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all border-l-4 border-l-amber-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đang Xử Lý</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{inProgressTickets.length}</span>
            <span className="text-xs text-amber-600 font-semibold">In Progress</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đang đối soát & làm thủ tục</p>
        </div>

        {/* Card 3: Sắp hết SLA */}
        <div
          onClick={() => {
            setFilterStatus('all');
            setActiveTab('hr_tickets');
          }}
          className="p-5 rounded-2xl bg-white border border-orange-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all border-l-4 border-l-orange-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sắp Hết SLA</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-600">{nearSlaTickets.length}</span>
            <span className="text-xs text-orange-600 font-semibold">&lt; 8 giờ còn lại</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cần đẩy nhanh tiến độ xử lý</p>
        </div>

        {/* Card 4: Quá hạn SLA */}
        <div
          onClick={() => {
            setFilterStatus('all');
            setActiveTab('hr_tickets');
          }}
          className="p-5 rounded-2xl bg-white border border-red-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all border-l-4 border-l-red-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quá Hạn SLA</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600">{overdueTickets.length}</span>
            <span className="text-xs text-red-600 font-semibold">Vi phạm hạn cam kết</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cần ưu tiên xử lý khẩn hoặc escalate</p>
        </div>
      </div>

      {/* SLA Compliance Progress Card */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">Tỷ lệ tuân thủ cam kết SLA toàn team:</span>
            <span className="text-lg font-black text-emerald-700">{slaComplianceRate}%</span>
          </div>
          <p className="text-xs text-slate-500">
            Mục tiêu cam kết chất lượng dịch vụ (SLA Target): ≥ 90%. Đang duy trì trạng thái tốt.
          </p>
        </div>

        <div className="w-full md:w-80">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${slaComplianceRate}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
            <span>0%</span>
            <span>Mục tiêu 90%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Urgent Ticket Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Danh sách cần ưu tiên xử lý gấp</h2>
            <p className="text-xs text-slate-500">Sắp xếp theo hạn chót SLA gần nhất</p>
          </div>
          <button
            onClick={() => setActiveTab('hr_tickets')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Xem tất cả tickets <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
          {urgentQueue.map((t) => (
            <div
              key={t.id}
              onClick={() => selectTicket(t.id)}
              className="p-4 sm:p-5 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {t.ticketNumber}
                    </span>
                    <PriorityBadge priority={t.priority} size="sm" />
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{t.categoryName}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 truncate">{t.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Người gửi: <span className="font-medium text-slate-700">{t.requesterName}</span> ({t.requesterDepartment})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <SLACountdown ticket={t} />
                <StatusBadge status={t.status} size="sm" />
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                >
                  Xử lý
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
