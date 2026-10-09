import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketPriority, Attachment } from '../../types';
import {
  X,
  FileCheck,
  FileSpreadsheet,
  FileX,
  Send,
  HelpCircle,
  Shield,
  Gift,
  Receipt,
  Clock,
  Calendar,
  Compass,
  Briefcase,
  BookOpen,
  UserCheck,
  Award,
  TrendingUp,
  Sparkles,
  Paperclip,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  FileCheck: <FileCheck className="w-5 h-5 text-blue-600" />,
  FileSpreadsheet: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
  FileX: <FileX className="w-5 h-5 text-red-600" />,
  Send: <Send className="w-5 h-5 text-indigo-600" />,
  HelpCircle: <HelpCircle className="w-5 h-5 text-amber-600" />,
  Shield: <Shield className="w-5 h-5 text-teal-600" />,
  Gift: <Gift className="w-5 h-5 text-pink-600" />,
  Receipt: <Receipt className="w-5 h-5 text-purple-600" />,
  Clock: <Clock className="w-5 h-5 text-sky-600" />,
  Calendar: <Calendar className="w-5 h-5 text-orange-600" />,
  Compass: <Compass className="w-5 h-5 text-cyan-600" />,
  Briefcase: <Briefcase className="w-5 h-5 text-blue-700" />,
  BookOpen: <BookOpen className="w-5 h-5 text-indigo-700" />,
  UserCheck: <UserCheck className="w-5 h-5 text-emerald-700" />,
  Award: <Award className="w-5 h-5 text-amber-700" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-violet-700" />,
  Sparkles: <Sparkles className="w-5 h-5 text-yellow-600" />,
};

export const CreateTicketModal: React.FC = () => {
  const { categories, isCreateModalOpen, setCreateModalOpen, createTicket, selectTicket } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [customData, setCustomData] = useState<Record<string, string>>({});
  const [mockFiles, setMockFiles] = useState<Attachment[]>([]);
  const [uploadFileName, setUploadFileName] = useState<string>('');

  if (!isCreateModalOpen) return null;

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  // Group categories by groupName
  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.groupName]) acc[cat.groupName] = [];
    acc[cat.groupName].push(cat);
    return acc;
  }, {} as Record<string, typeof categories>);

  const handleCustomFieldChange = (label: string, value: string) => {
    setCustomData((prev) => ({ ...prev, [label]: value }));
  };

  const handleAddMockFile = () => {
    if (!uploadFileName.trim()) return;
    const newAtt: Attachment = {
      id: `att_${Date.now()}`,
      name: uploadFileName.trim(),
      size: Math.floor(Math.random() * 2000000) + 150000,
      type: uploadFileName.endsWith('.pdf') ? 'application/pdf' : 'image/png',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Tôi',
    };
    setMockFiles((prev) => [...prev, newAtt]);
    setUploadFileName('');
  };

  const handleRemoveMockFile = (id: string) => {
    setMockFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Vui lòng nhập đầy đủ Tiêu đề và Mô tả yêu cầu.');
      return;
    }

    const created = createTicket({
      title,
      description,
      categoryId: selectedCategoryId,
      priority,
      customData,
      attachments: mockFiles,
    });

    // Reset & navigate to detail
    setCreateModalOpen(false);
    setStep(1);
    setTitle('');
    setDescription('');
    setCustomData({});
    setMockFiles([]);
    selectTicket(created.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Gửi yêu cầu Nhân sự (HR Request)</h2>
            <p className="text-xs text-slate-500">
              Bước {step} trên 3 —{' '}
              {step === 1 && 'Chọn danh mục dịch vụ & Cam kết SLA'}
              {step === 2 && 'Điền thông tin chi tiết'}
              {step === 3 && 'Đính kèm tệp & Mức độ ưu tiên'}
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 pt-3">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Select Category */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3.5 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <p className="font-semibold">Quy trình tự động hóa tiếp nhận</p>
                  <p className="text-blue-700 mt-0.5">
                    Mỗi yêu cầu có thời hạn SLA xử lý cam kết riêng biệt. Sau khi gửi, HR chuyên trách sẽ tiếp nhận và phản hồi theo đúng thời hạn.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {Object.entries(groupedCategories).map(([groupTitle, cats]) => (
                  <div key={groupTitle}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                      {groupTitle}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {cats.map((cat) => {
                        const isSelected = selectedCategoryId === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                              isSelected
                                ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                            }`}
                          >
                            <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100 shrink-0">
                              {iconMap[cat.icon] || <FileCheck className="w-5 h-5 text-blue-600" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-sm font-bold text-slate-900 truncate">
                                  {cat.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                                {cat.description}
                              </p>
                              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit border border-emerald-200/60">
                                <Clock className="w-3 h-3" />
                                <span>SLA: {cat.slaDisplay}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Detail Form */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Selected Category Banner */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-700">
                <span className="font-medium">
                  Đang chọn:{' '}
                  <strong className="text-blue-700">{currentCategory.name}</strong> ({currentCategory.slaDisplay})
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Thay đổi
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tiêu đề yêu cầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Xin giấy xác nhận công tác để làm thủ tục xin visa du lịch"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Dynamic Category Fields */}
              {currentCategory.requiredFields && currentCategory.requiredFields.length > 0 && (
                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
                    Thông tin bổ sung theo loại yêu cầu
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentCategory.requiredFields.map((field) => (
                      <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === 'select' && (
                          <select
                            value={customData[field.label] || ''}
                            onChange={(e) => handleCustomFieldChange(field.label, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-- Vui lòng chọn --</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}

                        {field.type === 'date' && (
                          <input
                            type="date"
                            value={customData[field.label] || ''}
                            onChange={(e) => handleCustomFieldChange(field.label, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                          />
                        )}

                        {(field.type === 'text' || field.type === 'number') && (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={customData[field.label] || ''}
                            onChange={(e) => handleCustomFieldChange(field.label, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mô tả chi tiết nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ghi rõ lý do, mốc thời gian cụ thể hoặc bất kỳ lưu ý quan trọng nào để HR hỗ trợ bạn nhanh nhất có thể..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Priority & Attachments */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Priority Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Mức độ khẩn cấp (Priority)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'low', label: 'Thấp', desc: 'Có thể xử lý thư thả' },
                    { id: 'medium', label: 'Bình thường', desc: 'Tiêu chuẩn theo SLA' },
                    { id: 'high', label: 'Ưu tiên cao', desc: 'Cần hỗ trợ sớm' },
                    { id: 'urgent', label: 'Khẩn cấp', desc: 'Ảnh hưởng trực tiếp ngay' },
                  ].map((p) => {
                    const isSelected = priority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id as TicketPriority)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`text-xs font-bold block ${
                            p.id === 'urgent'
                              ? 'text-red-600'
                              : p.id === 'high'
                              ? 'text-amber-600'
                              : 'text-slate-800'
                          }`}
                        >
                          {p.label}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Attachments Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Đính kèm tệp tin / Giấy tờ liên quan (Tùy chọn)
                </label>

                {/* Simulated file upload input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Nhập tên tệp đính kèm (Ví dụ: cccd_scan.pdf, hop_dong.docx)"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddMockFile}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Đính kèm
                  </button>
                </div>

                {mockFiles.length > 0 ? (
                  <div className="space-y-2">
                    {mockFiles.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-medium text-slate-800 truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400">
                            ({(f.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMockFile(f.id)}
                          className="text-red-500 hover:text-red-700 ml-2 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500 bg-slate-50/50">
                    <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    Kéo thả hoặc nhập tên tệp scan/ảnh chụp hồ sơ để đính kèm (PDF, DOCX, JPG, PNG - Max 10MB)
                  </div>
                )}
              </div>

              {/* Review Summary Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <span className="font-bold text-slate-900 block">Tóm tắt yêu cầu:</span>
                <p>
                  <strong>Loại yêu cầu:</strong> {currentCategory.name}
                </p>
                <p>
                  <strong>Thời hạn cam kết SLA:</strong> {currentCategory.slaDisplay}
                </p>
                <p>
                  <strong>Tiêu đề:</strong> {title || '(Chưa nhập)'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/60">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 2 && (!title.trim() || !description.trim())) {
                    alert('Vui lòng nhập Tiêu đề và Mô tả trước khi tiếp tục.');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all"
              >
                Tiếp tục
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Xác nhận & Gửi yêu cầu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
