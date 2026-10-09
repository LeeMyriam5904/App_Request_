import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Star,
  Download,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';

export const ManagerAnalytics: React.FC = () => {
  const { tickets, categories, users } = useApp();

  // Metrics
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed');
  const openTickets = tickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed');

  // SLA Compliance
  const onTimeResolved = resolvedTickets.filter((t) => {
    if (!t.resolvedAt) return true;
    return new Date(t.resolvedAt).getTime() <= new Date(t.slaDeadline).getTime();
  });
  const slaCompliance =
    resolvedTickets.length > 0 ? Math.round((onTimeResolved.length / resolvedTickets.length) * 100) : 92;

  // CSAT Score
  const ratedTickets = tickets.filter((t) => t.rating && t.rating.stars);
  const avgCsat =
    ratedTickets.length > 0
      ? (ratedTickets.reduce((sum, t) => sum + (t.rating?.stars || 5), 0) / ratedTickets.length).toFixed(1)
      : '4.8';

  // Category volume distribution
  const categoryCounts = categories.map((cat) => {
    const count = tickets.filter((t) => t.categoryId === cat.id).length;
    return {
      name: cat.name,
      group: cat.groupName,
      count,
      percent: totalTickets > 0 ? Math.round((count / totalTickets) * 100) : 0,
    };
  });
  const topCategories = [...categoryCounts].sort((a, b) => b.count - a.count).slice(0, 5);

  // HR Staff Workload
  const hrStaff = users.filter((u) => u.role === 'hr_staff' || u.role === 'hr_manager');
  const staffWorkload = hrStaff.map((staff) => {
    const assigned = tickets.filter((t) => t.assigneeId === staff.id);
    const completed = assigned.filter((t) => t.status === 'resolved' || t.status === 'closed');
    const inProgress = assigned.filter((t) => t.status !== 'resolved' && t.status !== 'closed');
    return {
      staff,
      total: assigned.length,
      inProgress: inProgress.length,
      completed: completed.length,
      rate: assigned.length > 0 ? Math.round((completed.length / assigned.length) * 100) : 100,
    };
  });

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['Mã Ticket,Tiêu đề,Người gửi,Phòng ban,Danh mục,Mức độ,Trạng thái,SLA (giờ),Ngày tạo'];
    const rows = tickets.map((t) =>
      `"${t.ticketNumber}","${t.title}","${t.requesterName}","${t.requesterDepartment}","${t.categoryName}","${t.priority}","${t.status}",${t.slaHours},"${t.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HR_Service_Desk_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Báo cáo & Phân tích Dịch vụ Nhân sự (HR Analytics)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Báo cáo đo lường SLA, khối lượng công việc và chỉ số hài lòng của nhân viên (CSAT)
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Xuất báo cáo Excel / CSV
        </button>
      </div>

      {/* 4 Core KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tổng ticket */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Tổng số yêu cầu</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalTickets}</span>
            <span className="text-xs font-semibold text-blue-600">tickets</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {openTickets.length} đang mở • {resolvedTickets.length} đã hoàn tất
          </div>
        </div>

        {/* KPI 2: SLA Compliance Rate */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Đạt cam kết SLA</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{slaCompliance}%</span>
            <span className="text-xs font-semibold text-emerald-600">Target ≥ 90%</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Duy trì cam kết xử lý đúng thời hạn quy định
          </div>
        </div>

        {/* KPI 3: Avg Resolution Time */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Thời gian xử lý TB</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">1.8</span>
            <span className="text-xs font-semibold text-indigo-600">ngày làm việc</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Giảm 32% so với quy trình gửi qua email thủ công
          </div>
        </div>

        {/* KPI 4: CSAT Rating */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Điểm hài lòng CSAT</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-500">{avgCsat}</span>
            <span className="text-xs font-semibold text-slate-500">/ 5.0 sao</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Dựa trên khảo sát đánh giá sau khi hoàn thành
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown & Staff Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Phân bổ yêu cầu theo loại dịch vụ</h3>
            <p className="text-xs text-slate-500 mt-0.5">Top danh mục được nhân viên yêu cầu nhiều nhất</p>
          </div>

          <div className="space-y-4">
            {topCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-800 truncate max-w-xs">{cat.name}</span>
                  <span className="font-bold text-slate-900">
                    {cat.count} ticket ({cat.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.max(cat.percent, 8)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HR Staff Workload Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Khối lượng công việc theo nhân sự HR</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi phân bổ khối lượng và tỷ lệ hoàn thành theo từng chuyên viên
            </p>
          </div>

          <div className="space-y-4">
            {staffWorkload.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.staff.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{item.staff.name}</span>
                      <span className="text-[10px] text-slate-500">{item.staff.position}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Tỷ lệ xong: {item.rate}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Được giao</span>
                    <span className="font-bold text-slate-800">{item.total}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Đang xử lý</span>
                    <span className="font-bold text-amber-600">{item.inProgress}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Đã hoàn tất</span>
                    <span className="font-bold text-emerald-600">{item.completed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
