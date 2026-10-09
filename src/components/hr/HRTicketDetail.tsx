import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { SLACountdown } from '../common/SLACountdown';
import { TicketStatus, TicketPriority } from '../../types';
import {
  ArrowLeft,
  User,
  Mail,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Send,
  Lock,
  FileText,
  Paperclip,
  BookmarkCheck,
  History,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const HRTicketDetail: React.FC = () => {
  const {
    tickets,
    comments,
    templates,
    auditLogs,
    users,
    currentUser,
    selectedTicketId,
    selectTicket,
    updateTicketStatus,
    assignTicket,
    addComment,
    requestMoreInfo,
    escalateTicket,
  } = useApp();

  const [activeCommentTab, setActiveCommentTab] = useState<'public' | 'internal'>('public');
  const [commentText, setCommentText] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  const ticket = tickets.find((t) => t.id === selectedTicketId);

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Không tìm thấy ticket.</p>
        <button
          onClick={() => selectTicket(null)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // Comments for this ticket
  const ticketComments = comments.filter((c) => c.ticketId === ticket.id);
  const publicComments = ticketComments.filter((c) => !c.isInternal);
  const internalNotes = ticketComments.filter((c) => c.isInternal);

  // Audit logs for this ticket
  const ticketLogs = auditLogs.filter((l) => l.ticketId === ticket.id);

  const hrStaffUsers = users.filter((u) => u.role === 'hr_staff' || u.role === 'hr_manager');

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tplId = e.target.value;
    setSelectedTemplateId(tplId);
    const tpl = templates.find((t) => t.id === tplId);
    if (tpl) {
      setCommentText(tpl.content);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(ticket.id, commentText.trim(), activeCommentTab === 'internal');
    setCommentText('');
    setSelectedTemplateId('');
  };

  const statusOptions: { value: TicketStatus; label: string }[] = [
    { value: 'submitted', label: '1. Mới gửi (Submitted)' },
    { value: 'in_review', label: '2. Đang xem xét (In Review)' },
    { value: 'need_info', label: '3. Cần NV bổ sung (Need Info - Tạm dừng SLA)' },
    { value: 'in_progress', label: '4. Đang xử lý (In Progress)' },
    { value: 'pending_approval', label: '5. Chờ phê duyệt (Pending Approval)' },
    { value: 'escalated', label: '6. Chuyển cấp trên (Escalated)' },
    { value: 'resolved', label: '7. Đã hoàn thành (Resolved)' },
    { value: 'closed', label: '8. Đã đóng (Closed)' },
    { value: 'reopened', label: '9. Mở lại (Reopened)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => selectTicket(null)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-sm self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách tickets
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            {ticket.ticketNumber}
          </span>
          <SLACountdown ticket={ticket} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Split Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main Ticket Content & Chat (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Ticket Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-700">{ticket.categoryGroup}</span>
                <span>•</span>
                <span>{ticket.categoryName}</span>
                <PriorityBadge priority={ticket.priority} size="sm" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-1">{ticket.title}</h1>
            </div>

            {/* Requester Profile Card */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {ticket.requesterName.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{ticket.requesterName}</span>
                  <span className="text-slate-500 text-[11px]">
                    {ticket.requesterDepartment} • {ticket.requesterEmail}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">
                Gửi lúc: {new Date(ticket.createdAt).toLocaleString('vi-VN')}
              </span>
            </div>

            {/* Description */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Nội dung yêu cầu từ nhân viên:
              </span>
              <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                {ticket.description}
              </p>
            </div>

            {/* Dynamic Custom Fields */}
            {ticket.customData && Object.keys(ticket.customData).length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Thông tin trường bổ sung:
                </span>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                  {Object.entries(ticket.customData).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-[11px] text-slate-400 block">{k}</span>
                      <span className="font-bold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Tệp đính kèm ({ticket.attachments.length}):
                </span>
                <div className="space-y-1.5">
                  {ticket.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {(att.size / 1024).toFixed(0)} KB • {att.uploadedBy}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabbed Comments & Internal Notes Area */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            {/* Tab Selector */}
            <div className="px-6 pt-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveCommentTab('public')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeCommentTab === 'public'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Trao đổi với Nhân viên ({publicComments.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCommentTab('internal')}
                  className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeCommentTab === 'internal'
                      ? 'border-amber-600 text-amber-700'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Ghi chú nội bộ HR ({internalNotes.length})
                </button>
              </div>

              {/* Template Picker */}
              {activeCommentTab === 'public' && (
                <div className="hidden sm:flex items-center gap-1.5 pb-2">
                  <span className="text-[11px] text-slate-400">Mẫu câu trả lời:</span>
                  <select
                    value={selectedTemplateId}
                    onChange={handleTemplateSelect}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 max-w-[200px]"
                  >
                    <option value="">-- Chọn câu trả lời mẫu --</option>
                    {templates.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Comment Thread List */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {activeCommentTab === 'public' ? (
                publicComments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    Chưa có tin nhắn nào được trao đổi với nhân viên.
                  </div>
                ) : (
                  publicComments.map((cmt) => (
                    <div key={cmt.id} className="flex gap-3 text-xs">
                      <img
                        src={cmt.authorAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
                      />
                      <div className="flex-1 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/60 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-800">
                            {cmt.authorName} ({cmt.authorRole === 'employee' ? 'Nhân viên' : 'HR Specialist'})
                          </span>
                          <span className="text-slate-400">
                            {new Date(cmt.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">{cmt.content}</p>
                      </div>
                    </div>
                  ))
                )
              ) : internalNotes.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Chưa có ghi chú nội bộ nào. Thêm ghi chú để đồng nghiệp HR cùng nắm tiến độ.
                </div>
              ) : (
                internalNotes.map((note) => (
                  <div key={note.id} className="flex gap-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                      🔒
                    </div>
                    <div className="flex-1 bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-amber-900 font-bold">
                        <span>{note.authorName} (Ghi chú nội bộ - Chỉ HR thấy)</span>
                        <span className="text-amber-700 font-normal">
                          {new Date(note.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-amber-950 leading-relaxed whitespace-pre-line">{note.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendComment} className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-2">
              {activeCommentTab === 'internal' && (
                <div className="text-[11px] text-amber-800 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  Chế độ Ghi chú nội bộ: Nhân viên sẽ KHÔNG nhìn thấy nội dung này.
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  placeholder={
                    activeCommentTab === 'internal'
                      ? 'Nhập ghi chú thảo luận nội bộ với đồng nghiệp HR...'
                      : 'Nhập nội dung phản hồi chính thức cho nhân viên...'
                  }
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <button
                  type="submit"
                  className={`px-5 font-bold text-xs rounded-xl text-white shadow-sm flex items-center justify-center gap-1.5 transition-all self-end py-2.5 ${
                    activeCommentTab === 'internal'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Gửi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Actions, Status, Assignee, SLA, History (1 col) */}
        <div className="space-y-6">
          {/* Quick Action Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Thao tác xử lý nhanh
            </h3>

            <div className="space-y-2">
              {/* Claim / Assign to me */}
              {ticket.assigneeId !== currentUser.id && (
                <button
                  onClick={() => assignTicket(ticket.id, currentUser.id)}
                  className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Tiếp nhận ticket này (Nhận việc)
                </button>
              )}

              {/* Need Info Action */}
              <button
                onClick={() => {
                  const note = prompt('Nhập nội dung thông tin cần nhân viên bổ sung:');
                  if (note) requestMoreInfo(ticket.id, note);
                }}
                className="w-full py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs font-bold border border-orange-200 flex items-center justify-center gap-2 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                Yêu cầu NV bổ sung (Tạm dừng SLA)
              </button>

              {/* Escalate Action */}
              <button
                onClick={() => {
                  const reason = prompt('Nhập lý do chuyển cấp (Escalate) lên Trưởng phòng:');
                  if (reason) escalateTicket(ticket.id, reason);
                }}
                className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold border border-purple-200 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
                Escalate lên HR Manager
              </button>

              {/* Resolve Action */}
              <button
                onClick={() => {
                  if (window.confirm('Xác nhận hoàn thành xử lý và thông báo kết quả cho nhân viên?')) {
                    updateTicketStatus(ticket.id, 'resolved', 'HR đã xử lý xong');
                  }
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Hoàn tất & Báo kết quả (Resolve)
              </button>
            </div>
          </div>

          {/* Management Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
              Cập nhật Trạng thái & Phân công
            </h3>

            {/* Status Select */}
            <div>
              <label className="block text-slate-500 font-medium mb-1">Trạng thái ticket:</label>
              <select
                value={ticket.status}
                onChange={(e) => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee Select */}
            <div>
              <label className="block text-slate-500 font-medium mb-1">Chuyên viên phụ trách:</label>
              <select
                value={ticket.assigneeId || ''}
                onChange={(e) => assignTicket(ticket.id, e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-medium text-slate-800 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chưa phân công --</option>
                {hrStaffUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role === 'hr_manager' ? 'Manager' : 'Specialist'})
                  </option>
                ))}
              </select>
            </div>

            {/* SLA details */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Quy định SLA:</span>
                <span className="font-bold text-slate-700">{ticket.slaHours} giờ làm việc</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hạn chót:</span>
                <span className="font-bold text-blue-700">
                  {new Date(ticket.slaDeadline).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-400">Tình trạng:</span>
                <SLACountdown ticket={ticket} />
              </div>
            </div>
          </div>

          {/* Audit History Log */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <History className="w-4 h-4 text-slate-500" />
              <span>Nhật ký xử lý (Audit Trail)</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto text-[11px]">
              {ticketLogs.map((log) => (
                <div key={log.id} className="relative pl-4 border-l-2 border-slate-200 py-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 absolute -left-[5px] top-1.5" />
                  <span className="font-bold text-slate-800 block">{log.actorName}</span>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {new Date(log.timestamp).toLocaleString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
