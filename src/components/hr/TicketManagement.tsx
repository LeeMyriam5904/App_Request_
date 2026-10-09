import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { SLACountdown } from '../common/SLACountdown';
import { Ticket, TicketStatus } from '../../types';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  UserCheck,
  ChevronRight,
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
} from 'lucide-react';

interface TicketManagementProps {
  initialViewMode?: 'table' | 'kanban';
}

export const TicketManagement: React.FC<TicketManagementProps> = ({ initialViewMode = 'table' }) => {
  const {
    tickets,
    users,
    categories,
    currentUser,
    filterStatus,
    setFilterStatus,
    selectTicket,
    assignTicket,
    updateTicketStatus,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>(initialViewMode);
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const hrStaffUsers = users.filter((u) => u.role === 'hr_staff' || u.role === 'hr_manager');

  const filteredTickets = tickets.filter((t) => {
    // Status
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;

    // Assignee
    if (assigneeFilter === 'me' && t.assigneeId !== currentUser.id) return false;
    if (assigneeFilter === 'unassigned' && t.assigneeId) return false;
    if (assigneeFilter !== 'all' && assigneeFilter !== 'me' && assigneeFilter !== 'unassigned') {
      if (t.assigneeId !== assigneeFilter) return false;
    }

    // Priority
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;

    // Category
    if (categoryFilter !== 'all' && t.categoryId !== categoryFilter) return false;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        t.ticketNumber.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.requesterName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Kanban Columns configuration
  const kanbanColumns: {
    id: string;
    title: string;
    statuses: TicketStatus[];
    color: string;
    bg: string;
  }[] = [
    {
      id: 'col_new',
      title: 'Mới gửi (Chờ nhận)',
      statuses: ['submitted', 'in_review'],
      color: 'border-blue-500 text-blue-700',
      bg: 'bg-blue-50/40',
    },
    {
      id: 'col_progress',
      title: 'Đang xử lý',
      statuses: ['in_progress'],
      color: 'border-amber-500 text-amber-700',
      bg: 'bg-amber-50/40',
    },
    {
      id: 'col_need_info',
      title: 'Cần bổ sung',
      statuses: ['need_info'],
      color: 'border-orange-500 text-orange-700',
      bg: 'bg-orange-50/40',
    },
    {
      id: 'col_approval',
      title: 'Chờ duyệt / Escalate',
      statuses: ['pending_approval', 'escalated'],
      color: 'border-purple-500 text-purple-700',
      bg: 'bg-purple-50/40',
    },
    {
      id: 'col_done',
      title: 'Đã hoàn thành',
      statuses: ['resolved', 'closed'],
      color: 'border-emerald-500 text-emerald-700',
      bg: 'bg-emerald-50/40',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quản lý Yêu cầu HR</h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng: <strong className="text-slate-800">{tickets.length}</strong> yêu cầu • Đang lọc:{' '}
            <strong className="text-blue-600">{filteredTickets.length}</strong> kết quả
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            Danh sách
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Bảng Kanban
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search query */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã ticket, tên nhân viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="submitted">Mới gửi (Submitted)</option>
            <option value="in_progress">Đang xử lý (In Progress)</option>
            <option value="need_info">Cần bổ sung (Need Info)</option>
            <option value="pending_approval">Chờ duyệt (Pending Approval)</option>
            <option value="escalated">Chuyển cấp (Escalated)</option>
            <option value="resolved">Đã hoàn tất (Resolved)</option>
            <option value="closed">Đã đóng (Closed)</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả người phụ trách</option>
            <option value="me">Chỉ của tôi ({currentUser.name})</option>
            <option value="unassigned">Chưa phân công</option>
            {hrStaffUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả mức độ ưu tiên</option>
            <option value="urgent">Khẩn cấp (Urgent)</option>
            <option value="high">Cao (High)</option>
            <option value="medium">Trung bình (Medium)</option>
            <option value="low">Thấp (Low)</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-600">Không tìm thấy yêu cầu nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4 sm:px-6">Mã Ticket</th>
                    <th className="py-3.5 px-4">Yêu cầu & Danh mục</th>
                    <th className="py-3.5 px-4">Người gửi</th>
                    <th className="py-3.5 px-4">Ưu tiên</th>
                    <th className="py-3.5 px-4">Trạng thái</th>
                    <th className="py-3.5 px-4">Cam kết SLA</th>
                    <th className="py-3.5 px-4">Phụ trách</th>
                    <th className="py-3.5 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredTickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => selectTicket(t.id)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-blue-700 whitespace-nowrap">
                        {t.ticketNumber}
                      </td>
                      <td className="py-4 px-4 max-w-xs sm:max-w-sm">
                        <div className="font-bold text-slate-900 truncate">{t.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{t.categoryName}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{t.requesterName}</div>
                        <div className="text-[11px] text-slate-400">{t.requesterDepartment}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <PriorityBadge priority={t.priority} size="sm" />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <StatusBadge status={t.status} size="sm" />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <SLACountdown ticket={t} />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {t.assigneeName ? (
                          <span className="font-medium text-slate-800">{t.assigneeName}</span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              assignTicket(t.id, currentUser.id);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                          >
                            <UserCheck className="w-3 h-3" />
                            Tiếp nhận
                          </button>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const columnTickets = filteredTickets.filter((t) => col.statuses.includes(t.status));

            return (
              <div key={col.id} className="bg-slate-100/70 rounded-2xl p-3 flex flex-col min-w-[260px]">
                {/* Column Header */}
                <div className={`p-2.5 bg-white rounded-xl border-l-4 ${col.color} shadow-sm mb-3 flex items-center justify-between`}>
                  <span className="text-xs font-bold text-slate-800">{col.title}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {columnTickets.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[70vh]">
                  {columnTickets.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      Trống
                    </div>
                  ) : (
                    columnTickets.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => selectTicket(t.id)}
                        className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2 text-left"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                            {t.ticketNumber}
                          </span>
                          <PriorityBadge priority={t.priority} size="sm" />
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{t.title}</h4>

                        <div className="text-[11px] text-slate-500 truncate">
                          NV: <span className="font-medium text-slate-700">{t.requesterName}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <SLACountdown ticket={t} showIcon={false} />
                          {t.assigneeName ? (
                            <span className="text-slate-600 truncate max-w-[90px]">{t.assigneeName.split(' ').pop()}</span>
                          ) : (
                            <span className="text-amber-600 font-semibold italic">Chưa nhận</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
