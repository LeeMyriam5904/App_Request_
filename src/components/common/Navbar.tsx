import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import {
  Bell,
  Users,
  Layers,
  BarChart3,
  Settings,
  PlusCircle,
  HelpCircle,
  RotateCcw,
  CheckCheck,
  ChevronDown,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    users,
    notifications,
    switchRole,
    activeTab,
    setActiveTab,
    setCreateModalOpen,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    selectTicket,
    resetDemoData,
  } = useApp();

  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isRoleMenuOpen, setRoleMenuOpen] = useState(false);

  // Unread notifications for current user
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || currentRole === 'hr_manager' || currentRole === 'admin'
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const roleLabels: Record<Role, { title: string; subtitle: string; color: string }> = {
    employee: {
      title: 'Nhân viên (Employee)',
      subtitle: 'Gửi & theo dõi yêu cầu',
      color: 'bg-emerald-500',
    },
    hr_staff: {
      title: 'HR Specialist (Staff)',
      subtitle: 'Xử lý tickets & SLA',
      color: 'bg-blue-600',
    },
    hr_manager: {
      title: 'HR Manager',
      subtitle: 'Giám sát & Báo cáo SLA',
      color: 'bg-purple-600',
    },
    admin: {
      title: 'Quản trị viên (Admin)',
      subtitle: 'Cấu hình hệ thống & User',
      color: 'bg-amber-600',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                selectTicket(null);
                if (currentRole === 'employee') setActiveTab('home');
                else if (currentRole === 'hr_staff') setActiveTab('hr_dashboard');
                else if (currentRole === 'hr_manager') setActiveTab('analytics');
                else setActiveTab('admin_users');
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">HR Service Desk</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                    Enterprise
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">Hệ thống xử lý yêu cầu Nhân sự tập trung</p>
              </div>
            </div>

            {/* Navigation Tabs based on Role */}
            <nav className="hidden md:flex items-center space-x-1">
              {currentRole === 'employee' && (
                <>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('home');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'home'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Trang chủ
                  </button>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('my_tickets');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'my_tickets'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Yêu cầu của tôi
                  </button>
                </>
              )}

              {currentRole === 'hr_staff' && (
                <>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('hr_dashboard');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'hr_dashboard'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Bàn làm việc (Dashboard)
                  </button>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('hr_tickets');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'hr_tickets'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Quản lý Tickets
                  </button>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('hr_kanban');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'hr_kanban'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Bảng Kanban
                  </button>
                </>
              )}

              {currentRole === 'hr_manager' && (
                <>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('analytics');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'analytics'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Báo cáo & Phân tích SLA
                  </button>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('hr_tickets');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'hr_tickets'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Toàn bộ Tickets
                  </button>
                </>
              )}

              {currentRole === 'admin' && (
                <>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('admin_users');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'admin_users'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Người dùng & Phân quyền
                  </button>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('admin_categories');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'admin_categories'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Danh mục & Cấu hình SLA
                  </button>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('admin_templates');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'admin_templates'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Mẫu phản hồi
                  </button>
                  <button
                    onClick={() => {
                      selectTicket(null);
                      setActiveTab('admin_logs');
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'admin_logs'
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Nhật ký hệ thống (Audit)
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right Header Area: Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Create Ticket Button (Primary for Employee) */}
            {currentRole === 'employee' && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all shadow-blue-500/20 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Gửi yêu cầu mới</span>
              </button>
            )}

            {/* In-app Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-800">Thông báo</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-700 rounded-full">
                          {unreadCount} mới
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Đã đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-400">
                        Chưa có thông báo nào mới
                      </div>
                    ) : (
                      userNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.ticketId) {
                              selectTicket(n.ticketId);
                              setNotifOpen(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          {n.ticketNumber && (
                            <span className="inline-block mt-1 text-[10px] font-mono font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {n.ticketNumber}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={() => {
                if (window.confirm('Khôi phục toàn bộ dữ liệu mẫu (tickets, hội thoại, SLA) về mặc định?')) {
                  resetDemoData();
                }
              }}
              title="Khôi phục dữ liệu mẫu ban đầu"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-800">{currentUser.name}</span>
                    <span className={`w-2 h-2 rounded-full ${roleLabels[currentRole].color}`} />
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-none">
                    {roleLabels[currentRole].title.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {/* Role Selection Dropdown Menu */}
              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 z-50 p-2 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Chuyển đổi Vai trò (Persona Switcher)
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chọn vai trò để trải nghiệm luồng làm việc tương ứng
                    </p>
                  </div>

                  <div className="space-y-1">
                    {(['employee', 'hr_staff', 'hr_manager', 'admin'] as Role[]).map((r) => {
                      const userForRole = users.find((u) => u.role === r);
                      const isSelected = currentRole === r;
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-blue-50 border border-blue-200 text-blue-900'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <img
                            src={userForRole?.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold truncate">{userForRole?.name}</span>
                              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {r.toUpperCase()}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 truncate block">
                              {roleLabels[r].subtitle}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
