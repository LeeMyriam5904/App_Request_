import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { SLACountdown } from '../common/SLACountdown';
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  Calendar,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

export const MyTicketsList: React.FC = () => {
  const {
    currentUser,
    tickets,
    categories,
    selectTicket,
    setCreateModalOpen,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const myTickets = tickets.filter((t) => t.requesterId === currentUser.id);

  const filteredTickets = myTickets.filter((t) => {
    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && (t.status === 'resolved' || t.status === 'closed')) return false;
      if (statusFilter === 'resolved' && t.status !== 'resolved' && t.status !== 'closed') return false;
      if (statusFilter === 'need_info' && t.status !== 'need_info') return false;
      if (statusFilter === t.status) {
        // match specific status
      }
    }

    // Category filter
    if (categoryFilter !== 'all' && t.categoryId !== categoryFilter) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNumber = t.ticketNumber.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchCategory = t.categoryName.toLowerCase().includes(q);
      if (!matchNumber && !matchTitle && !matchCategory) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Yêu cầu của tôi</h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tất cả yêu cầu dịch vụ Nhân sự bạn đã gửi và tiến độ xử lý
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 self-start sm:self-auto transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Tạo yêu cầu mới
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã ticket (#HR-2026-...), tiêu đề, từ khóa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang xử lý (Chưa đóng)</option>
            <option value="need_info">Cần bổ sung thông tin</option>
            <option value="resolved">Đã hoàn thành / Đã đóng</option>
            <option value="submitted">Đã gửi (Chờ nhận)</option>
            <option value="in_progress">Đang xử lý</option>
          </select>

          {/* Category Dropdown Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">Không tìm thấy yêu cầu phù hợp</p>
            <p className="text-xs text-slate-400 mt-1">
              Thử thay đổi bộ lọc tìm kiếm hoặc gửi yêu cầu mới.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Mã Ticket</th>
                  <th className="py-3.5 px-4">Tiêu đề & Danh mục</th>
                  <th className="py-3.5 px-4">Mức độ</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Hạn xử lý (SLA)</th>
                  <th className="py-3.5 px-4">Người phụ trách</th>
                  <th className="py-3.5 px-4 text-right">Chi tiết</th>
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
                    <td className="py-4 px-4 max-w-xs sm:max-w-md">
                      <div className="font-bold text-slate-900 truncate">{t.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{t.categoryName}</div>
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
                    <td className="py-4 px-4 whitespace-nowrap text-slate-600">
                      {t.assigneeName ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>{t.assigneeName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Đang phân công</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap text-slate-400">
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
