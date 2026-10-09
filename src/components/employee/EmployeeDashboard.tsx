import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { SLACountdown } from '../common/SLACountdown';
import { PriorityBadge } from '../common/PriorityBadge';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  HelpCircle,
  Sparkles,
  Search,
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { currentUser, tickets, selectTicket, setActiveTab, setCreateModalOpen } = useApp();

  const myTickets = tickets.filter((t) => t.requesterId === currentUser.id);

  const activeCount = myTickets.filter(
    (t) => t.status !== 'resolved' && t.status !== 'closed' && t.status !== 'need_info'
  ).length;

  const needInfoCount = myTickets.filter((t) => t.status === 'need_info').length;
  const completedCount = myTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;

  const recentTickets = myTickets.slice(0, 5);

  const categoryGroups = [
    {
      title: 'Giấy tờ & Xác nhận',
      desc: 'Xác nhận công tác, lương, thư xin visa, quyết định nghỉ việc',
      icon: '📄',
      sla: '3 - 5 ngày',
      bg: 'hover:border-blue-300 hover:bg-blue-50/40',
    },
    {
      title: 'Lương & Phúc lợi',
      desc: 'Thắc mắc tính lương, BHXH, đăng ký phúc lợi, thuế TNCN',
      icon: '💰',
      sla: '2 - 10 ngày',
      bg: 'hover:border-emerald-300 hover:bg-emerald-50/40',
    },
    {
      title: 'Nghỉ phép & Chấm công',
      desc: 'Quên quẹt thẻ vân tay, nghỉ đặc biệt, kiểm tra phép năm',
      icon: '🏖️',
      sla: '1 - 3 ngày',
      bg: 'hover:border-amber-300 hover:bg-amber-50/40',
    },
    {
      title: 'Hợp đồng & Chính sách',
      desc: 'Gia hạn HĐLĐ, cập nhật CCCD/ngân hàng, hỏi chính sách',
      icon: '📋',
      sla: '2 - 7 ngày',
      bg: 'hover:border-purple-300 hover:bg-purple-50/40',
    },
    {
      title: 'Đào tạo & Phát triển',
      desc: 'Đăng ký tài trợ chứng chỉ, học phí, đề xuất mentor',
      icon: '🎓',
      sla: '5 ngày',
      bg: 'hover:border-pink-300 hover:bg-pink-50/40',
    },
    {
      title: 'Yêu cầu hỗ trợ khác',
      desc: 'Các yêu cầu nhân sự đặc biệt và tư vấn chuyên biệt',
      icon: '🔧',
      sla: '5 ngày',
      bg: 'hover:border-indigo-300 hover:bg-indigo-50/40',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 sm:p-10 text-white shadow-xl shadow-blue-900/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Cổng Dịch vụ Nhân sự Tập trung
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xin chào, {currentUser.name}! 👋
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
            Bạn cần HR hỗ trợ thủ tục gì hôm nay? Gửi yêu cầu trực tiếp, theo dõi tiến độ thời gian thực và nhận phản hồi minh bạch theo cam kết SLA.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-800 text-sm font-bold shadow-md hover:bg-blue-50 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Tạo yêu cầu mới ngay
            </button>
            <button
              onClick={() => setActiveTab('my_tickets')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur-sm border border-white/20 transition-all"
            >
              Xem danh sách yêu cầu ({myTickets.length})
            </button>
          </div>
        </div>

        {/* Quick Stats Badges inside Banner */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-3 gap-4 max-w-lg">
          <div>
            <span className="text-xs text-blue-200">Đang xử lý</span>
            <p className="text-2xl font-black text-white">{activeCount}</p>
          </div>
          <div>
            <span className="text-xs text-blue-200">Cần bổ sung</span>
            <p className="text-2xl font-black text-amber-300">{needInfoCount}</p>
          </div>
          <div>
            <span className="text-xs text-blue-200">Đã giải quyết</span>
            <p className="text-2xl font-black text-emerald-300">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Alert if any ticket needs info */}
      {needInfoCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Bạn có {needInfoCount} yêu cầu đang chờ bổ sung thông tin
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Vui lòng xem chi tiết ticket và phản hồi lại tin nhắn của HR để tiếp tục tiến trình xử lý.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('my_tickets')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Xem ngay
          </button>
        </div>
      )}

      {/* Category Selection Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Danh mục dịch vụ Nhân sự</h2>
            <p className="text-xs text-slate-500">Chọn nhóm danh mục để bắt đầu tạo yêu cầu nhanh</p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Xem toàn bộ mẫu form <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryGroups.map((group, idx) => (
            <div
              key={idx}
              onClick={() => setCreateModalOpen(true)}
              className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm cursor-pointer transition-all ${group.bg}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{group.icon}</span>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  SLA: {group.sla}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-3">{group.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {group.desc}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <span>Gửi yêu cầu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tickets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Yêu cầu gần đây của bạn</h2>
            <p className="text-xs text-slate-500">Tiến độ cập nhật thời gian thực</p>
          </div>
          <button
            onClick={() => setActiveTab('my_tickets')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Xem tất cả ({myTickets.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-700">Chưa có yêu cầu nào</h4>
            <p className="text-xs text-slate-400 mt-1">
              Bạn chưa gửi yêu cầu hỗ trợ nhân sự nào trên hệ thống.
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              Gửi yêu cầu đầu tiên
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => selectTicket(ticket.id)}
                className="p-4 sm:p-5 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {ticket.ticketNumber}
                      </span>
                      <PriorityBadge priority={ticket.priority} size="sm" />
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{ticket.categoryName}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 truncate">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tạo lúc {new Date(ticket.createdAt).toLocaleDateString('vi-VN')} • Phụ trách:{' '}
                      <span className="font-medium text-slate-700">
                        {ticket.assigneeName || 'Đang chờ phân công'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <SLACountdown ticket={ticket} />
                  <StatusBadge status={ticket.status} />
                  <ArrowRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
