import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { CreateTicketModal } from './components/employee/CreateTicketModal';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { MyTicketsList } from './components/employee/MyTicketsList';
import { TicketDetailView } from './components/employee/TicketDetailView';
import { HRDashboard } from './components/hr/HRDashboard';
import { TicketManagement } from './components/hr/TicketManagement';
import { HRTicketDetail } from './components/hr/HRTicketDetail';
import { ManagerAnalytics } from './components/manager/ManagerAnalytics';
import { AdminPanel } from './components/admin/AdminPanel';
import { Layers, FileText } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentRole, activeTab, selectedTicketId } = useApp();

  const renderMainView = () => {
    // If a ticket is currently selected, show the detail view
    if (selectedTicketId) {
      if (currentRole === 'employee') {
        return <TicketDetailView />;
      }
      return <HRTicketDetail />;
    }

    // Role: Employee
    if (currentRole === 'employee') {
      if (activeTab === 'my_tickets') {
        return <MyTicketsList />;
      }
      return <EmployeeDashboard />;
    }

    // Role: HR Specialist
    if (currentRole === 'hr_staff') {
      if (activeTab === 'hr_tickets') {
        return <TicketManagement initialViewMode="table" />;
      }
      if (activeTab === 'hr_kanban') {
        return <TicketManagement initialViewMode="kanban" />;
      }
      return <HRDashboard />;
    }

    // Role: HR Manager
    if (currentRole === 'hr_manager') {
      if (activeTab === 'hr_tickets') {
        return <TicketManagement initialViewMode="table" />;
      }
      return <ManagerAnalytics />;
    }

    // Role: Admin
    if (currentRole === 'admin') {
      return <AdminPanel />;
    }

    return <EmployeeDashboard />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pb-16">{renderMainView()}</main>

      <CreateTicketModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">HR Service Desk Enterprise</span>
            <span>•</span>
            <span>Tuân thủ PRD v1.0 (Quy trình 10 trạng thái, SLA countdown, RBAC 4 Roles)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Dữ liệu mẫu tự động lưu trữ trên LocalStorage</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
