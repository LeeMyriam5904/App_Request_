import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Sliders,
  FileCode,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  Clock,
  RotateCcw,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    users,
    categories,
    templates,
    auditLogs,
    activeTab,
    setActiveTab,
    updateCategorySla,
    addTemplate,
    deleteTemplate,
    resetDemoData,
  } = useApp();

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingSlaHours, setEditingSlaHours] = useState<number>(24);

  // New Template form state
  const [newTplTitle, setNewTplTitle] = useState('');
  const [newTplCatId, setNewTplCatId] = useState(categories[0]?.id || '');
  const [newTplContent, setNewTplContent] = useState('');
  const [showAddTpl, setShowAddTpl] = useState(false);

  const handleSaveSla = (catId: string) => {
    updateCategorySla(catId, editingSlaHours);
    setEditingCatId(null);
  };

  const handleAddTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplTitle.trim() || !newTplContent.trim()) return;
    addTemplate(newTplTitle, newTplCatId, newTplContent);
    setNewTplTitle('');
    setNewTplContent('');
    setShowAddTpl(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản trị Hệ thống (Admin Panel)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý người dùng, phân quyền RBAC, cấu hình thời hạn SLA và mẫu câu trả lời
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Khôi phục toàn bộ dữ liệu mẫu (tickets, SLA, users)?')) {
              resetDemoData();
            }
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo Data
        </button>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'admin_users', label: '1. Người dùng & Phân quyền', icon: <Users className="w-4 h-4" /> },
          { id: 'admin_categories', label: '2. Danh mục & Cấu hình SLA', icon: <Sliders className="w-4 h-4" /> },
          { id: 'admin_templates', label: '3. Mẫu câu trả lời nhanh', icon: <FileCode className="w-4 h-4" /> },
          { id: 'admin_logs', label: '4. Nhật ký hệ thống (Audit Logs)', icon: <Shield className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: USERS & RBAC */}
      {activeTab === 'admin_users' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Danh sách người dùng và phân quyền (RBAC)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hỗ trợ 4 vai trò: Employee (Nhân viên), HR Staff (Chuyên viên), HR Manager (Trưởng phòng), Admin (Quản trị viên)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-6">Họ tên & Email</th>
                  <th className="py-3 px-4">Mã nhân viên</th>
                  <th className="py-3 px-4">Phòng ban</th>
                  <th className="py-3 px-4">Vị trí</th>
                  <th className="py-3 px-4">Vai trò (Role)</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[11px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">{u.employeeId}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.department}</td>
                    <td className="py-3.5 px-4 text-slate-600">{u.position}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Đang hoạt động
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES & SLA */}
      {activeTab === 'admin_categories' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Cấu hình Danh mục dịch vụ & Cam kết SLA</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Thay đổi số giờ cam kết SLA (Service Level Agreement) cho từng loại yêu cầu của nhân viên
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-6">Tên loại yêu cầu</th>
                  <th className="py-3 px-4">Nhóm danh mục</th>
                  <th className="py-3 px-4">Mô tả tóm tắt</th>
                  <th className="py-3 px-4">Cam kết SLA hiện tại</th>
                  <th className="py-3 px-4 text-right">Điều chỉnh SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/60">
                    <td className="py-3.5 px-6 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{cat.groupName}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{cat.description}</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-700 whitespace-nowrap">
                      {cat.slaDisplay}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {editingCatId === cat.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <input
                            type="number"
                            min={4}
                            max={160}
                            step={4}
                            value={editingSlaHours}
                            onChange={(e) => setEditingSlaHours(Number(e.target.value))}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                          <span className="text-[11px] text-slate-400">giờ</span>
                          <button
                            type="button"
                            onClick={() => handleSaveSla(cat.id)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Lưu"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingSlaHours(cat.slaHours);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Sửa SLA
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: RESPONSE TEMPLATES */}
      {activeTab === 'admin_templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Thư viện câu trả lời mẫu (Response Templates)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Giúp nhân viên HR phản hồi nhanh các trường hợp thường gặp chỉ bằng 1 thao tác chọn
              </p>
            </div>
            <button
              onClick={() => setShowAddTpl(!showAddTpl)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm mẫu mới
            </button>
          </div>

          {/* Add Template Form */}
          {showAddTpl && (
            <form
              onSubmit={handleAddTemplateSubmit}
              className="p-5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-3"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Tạo mẫu phản hồi mới
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tiêu đề gợi nhớ
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hướng dẫn bổ sung hồ sơ thuế"
                    value={newTplTitle}
                    onChange={(e) => setNewTplTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Áp dụng cho danh mục</label>
                  <select
                    value={newTplCatId}
                    onChange={(e) => setNewTplCatId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung câu trả lời mẫu</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Nhập nội dung mẫu..."
                  value={newTplContent}
                  onChange={(e) => setNewTplContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTpl(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Lưu mẫu
                </button>
              </div>
            </form>
          )}

          {/* Templates List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{tpl.title}</h4>
                  <button
                    onClick={() => deleteTemplate(tpl.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded"
                    title="Xóa mẫu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {tpl.categoryName && (
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                    {tpl.categoryName}
                  </span>
                )}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {tpl.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'admin_logs' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Nhật ký truy vết hệ thống (System Audit Logs)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ghi lại tất cả thao tác tạo mới, chuyển trạng thái, phân công và xử lý ticket trong hệ thống
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.actorName}</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 font-bold text-slate-700">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
