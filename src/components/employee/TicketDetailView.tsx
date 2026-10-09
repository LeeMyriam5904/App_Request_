import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { SLACountdown } from '../common/SLACountdown';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Paperclip,
  Send,
  Star,
  RefreshCcw,
  AlertCircle,
  FileText,
  User,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

export const TicketDetailView: React.FC = () => {
  const {
    tickets,
    comments,
    currentUser,
    selectedTicketId,
    selectTicket,
    addComment,
    rateTicket,
    reopenTicket,
    updateTicketStatus,
  } = useApp();

  const [message, setMessage] = useState<string>('');
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [reopenReason, setReopenReason] = useState<string>('');
  const [isReopenModalOpen, setReopenModalOpen] = useState<boolean>(false);

  const ticket = tickets.find((t) => t.id === selectedTicketId);

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Không tìm thấy yêu cầu này.</p>
        <button
          onClick={() => selectTicket(null)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // Filter public comments for employee (Employee cannot see internal notes)
  const ticketComments = comments.filter(
    (c) => c.ticketId === ticket.id && !c.isInternal
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addComment(ticket.id, message.trim(), false);
    setMessage('');

    // If ticket was need_info, employee replying automatically updates it back to in_review
    if (ticket.status === 'need_info') {
      updateTicketStatus(ticket.id, 'in_review', 'Nhân viên đã bổ sung phản hồi');
    }
  };

  const handleRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateTicket(ticket.id, ratingStars, feedback);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleReopenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    reopenTicket(ticket.id, reopenReason);
    setReopenModalOpen(false);
    setReopenReason('');
  };

  // Stepper logic
  const steps = [
    { label: 'Gửi yêu cầu', done: true },
    { label: 'Tiếp nhận', done: ticket.status !== 'draft' && ticket.status !== 'submitted' },
    { label: 'Đang xử lý', done: ['in_progress', 'pending_approval', 'escalated', 'resolved', 'closed'].includes(ticket.status) },
    { label: 'Hoàn thành', done: ['resolved', 'closed'].includes(ticket.status) },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => selectTicket(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách yêu cầu
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            {ticket.ticketNumber}
          </span>
          <SLACountdown ticket={ticket} />
        </div>
      </div>

      {/* Main Ticket Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {ticket.categoryGroup}
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs font-medium text-slate-600">{ticket.categoryName}</span>
              <PriorityBadge priority={ticket.priority} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {ticket.title}
            </h1>
          </div>
          <div className="shrink-0 self-start">
            <StatusBadge status={ticket.status} size="lg" />
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Tiến độ xử lý yêu cầu
          </span>
          <div className="grid grid-cols-4 gap-2">
            {steps.map((st, i) => (
              <div key={i} className="text-center">
                <div
                  className={`h-2 rounded-full mb-2 transition-all ${
                    st.done ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold block ${
                    st.done ? 'text-blue-900' : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Need Info Alert */}
        {ticket.status === 'need_info' && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-900 flex-1">
              <p className="font-bold">HR đang cần bạn bổ sung thêm thông tin</p>
              <p className="mt-0.5 text-orange-800">
                Vui lòng đọc phản hồi của HR bên dưới và nhập nội dung giải trình/đính kèm tệp tin để HR tiếp tục tiến trình xử lý. (Thời gian SLA đang được tạm dừng)
              </p>
            </div>
          </div>
        )}

        {/* Resolved Celebration / Rating Card */}
        {ticket.status === 'resolved' && !ticket.rating && (
          <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Yêu cầu của bạn đã được HR hoàn thành! 🎉
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Vui lòng dành 30 giây đánh giá chất lượng phục vụ của chuyên viên HR để giúp chúng tôi cải thiện dịch vụ.
                </p>
              </div>
            </div>

            <form onSubmit={handleRateSubmit} className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRatingStars(s)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= ratingStars
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {ratingStars === 5 && 'Rất hài lòng ⭐⭐⭐⭐⭐'}
                  {ratingStars === 4 && 'Hài lòng ⭐⭐⭐⭐'}
                  {ratingStars === 3 && 'Bình thường ⭐⭐⭐'}
                  {ratingStars === 2 && 'Chưa hài lòng ⭐⭐'}
                  {ratingStars === 1 && 'Rất thất vọng ⭐'}
                </span>
              </div>

              <textarea
                rows={2}
                placeholder="Nhận xét ngắn về chất lượng phục vụ của HR..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Gửi đánh giá & Xác nhận đóng ticket
                </button>

                <button
                  type="button"
                  onClick={() => setReopenModalOpen(true)}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  Kết quả chưa thỏa đáng? Yêu cầu mở lại
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rated Feedback Display */}
        {ticket.rating && (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 font-bold">
                <span>Bạn đã đánh giá dịch vụ:</span>
                <span className="text-amber-500">{'★'.repeat(ticket.rating.stars)}</span>
                <span className="text-slate-300">{'★'.repeat(5 - ticket.rating.stars)}</span>
              </div>
              {ticket.rating.feedback && (
                <p className="text-slate-600 italic mt-0.5">"{ticket.rating.feedback}"</p>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {new Date(ticket.rating.submittedAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
          <div className="space-y-2">
            <div>
              <span className="text-slate-400 font-semibold block">Mô tả yêu cầu:</span>
              <p className="text-slate-800 whitespace-pre-line mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {ticket.description}
              </p>
            </div>

            {/* Custom fields */}
            {ticket.customData && Object.keys(ticket.customData).length > 0 && (
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">Thông tin chi tiết:</span>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {Object.entries(ticket.customData).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-400 text-[11px] block">{k}</span>
                      <span className="font-semibold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Thông tin quản trị & SLA
              </span>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Người phụ trách HR:</span>
                <span className="font-bold text-slate-800">
                  {ticket.assigneeName || 'Đang chờ phân công'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Thời gian tạo:</span>
                <span className="font-medium text-slate-700">
                  {new Date(ticket.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Hạn cam kết SLA:</span>
                <span className="font-bold text-blue-700">
                  {new Date(ticket.slaDeadline).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Tệp đính kèm:</span>
                <div className="space-y-1.5">
                  {ticket.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-medium text-slate-800 truncate">{att.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {(att.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Two-Way Chat Conversation Thread */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">Trao đổi trực tiếp với HR</span>
            <span className="text-xs text-slate-400">({ticketComments.length} tin nhắn)</span>
          </div>
          <span className="text-xs text-slate-400">Thời gian thực</span>
        </div>

        {/* Message List */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {ticketComments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Chưa có phản hồi nào. Bạn có thể gửi tin nhắn hoặc câu hỏi thêm cho HR tại đây.
            </div>
          ) : (
            ticketComments.map((cmt) => {
              const isMe = cmt.authorId === currentUser.id;
              return (
                <div
                  key={cmt.id}
                  className={`flex gap-3 text-xs ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <img
                    src={cmt.authorAvatar}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
                  />
                  <div
                    className={`max-w-md rounded-2xl p-3.5 space-y-1 shadow-sm ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between gap-2 text-[10px] ${
                        isMe ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      <span className="font-bold">{cmt.authorName}</span>
                      <span>
                        {new Date(cmt.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line">{cmt.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn phản hồi cho HR chuyên trách..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Gửi
          </button>
        </form>
      </div>

      {/* Reopen Modal */}
      {isReopenModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Yêu cầu mở lại ticket này</h3>
            <p className="text-xs text-slate-500">
              Vui lòng cho biết lý do kết quả chưa đạt yêu cầu để HR tiến hành rà soát và xử lý lại.
            </p>
            <textarea
              rows={3}
              required
              placeholder="Ví dụ: Giấy xác nhận công tác bị sai chức danh, hoặc chưa có đủ mộc tròn..."
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReopenModalOpen(false)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleReopenSubmit}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
              >
                Xác nhận mở lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
