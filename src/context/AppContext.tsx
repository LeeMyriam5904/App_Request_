import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Category,
  Ticket,
  Comment,
  ResponseTemplate,
  InAppNotification,
  AuditLog,
  Role,
  TicketStatus,
  TicketPriority,
  Attachment,
} from '../types';
import {
  SEED_USERS,
  SEED_CATEGORIES,
  SEED_TICKETS,
  SEED_COMMENTS,
  SEED_TEMPLATES,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
} from '../data/seedData';

interface AppContextType {
  currentUser: User;
  currentRole: Role;
  users: User[];
  categories: Category[];
  tickets: Ticket[];
  comments: Comment[];
  templates: ResponseTemplate[];
  notifications: InAppNotification[];
  auditLogs: AuditLog[];
  activeTab: string;
  selectedTicketId: string | null;
  isCreateModalOpen: boolean;
  filterStatus: string;
  filterCategory: string;
  searchQuery: string;

  // Actions
  switchRole: (role: Role) => void;
  switchUser: (userId: string) => void;
  setActiveTab: (tab: string) => void;
  selectTicket: (ticketId: string | null) => void;
  setCreateModalOpen: (open: boolean) => void;
  setFilterStatus: (status: string) => void;
  setFilterCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;

  // Ticket Operations
  createTicket: (data: {
    title: string;
    description: string;
    categoryId: string;
    priority: TicketPriority;
    customData?: Record<string, string>;
    attachments?: Attachment[];
  }) => Ticket;
  updateTicketStatus: (ticketId: string, newStatus: TicketStatus, note?: string) => void;
  assignTicket: (ticketId: string, assigneeId: string) => void;
  addComment: (ticketId: string, content: string, isInternal?: boolean, attachments?: Attachment[]) => void;
  rateTicket: (ticketId: string, stars: number, feedback: string) => void;
  reopenTicket: (ticketId: string, reason: string) => void;
  escalateTicket: (ticketId: string, reason: string) => void;
  requestMoreInfo: (ticketId: string, note: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  updateCategorySla: (categoryId: string, newSlaHours: number) => void;
  addTemplate: (title: string, categoryId: string, content: string) => void;
  deleteTemplate: (id: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'HR_SERVICE_DESK_DATA_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or fallback to seed data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_USERS`);
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_CATEGORIES`);
    return saved ? JSON.parse(saved) : SEED_CATEGORIES;
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TICKETS`);
    return saved ? JSON.parse(saved) : SEED_TICKETS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_COMMENTS`);
    return saved ? JSON.parse(saved) : SEED_COMMENTS;
  });

  const [templates, setTemplates] = useState<ResponseTemplate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_TEMPLATES`);
    return saved ? JSON.parse(saved) : SEED_TEMPLATES;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_NOTIFICATIONS`);
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_LOGS`);
    return saved ? JSON.parse(saved) : SEED_AUDIT_LOGS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return 'usr_emp_01'; // Default employee: Nguyen Van Minh
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const currentRole = currentUser.role;

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_USERS`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_CATEGORIES`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_TICKETS`, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_COMMENTS`, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_TEMPLATES`, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_NOTIFICATIONS`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_LOGS`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Actions
  const switchRole = (newRole: Role) => {
    const targetUser = users.find((u) => u.role === newRole);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      setSelectedTicketId(null);
      if (newRole === 'employee') {
        setActiveTab('home');
      } else if (newRole === 'hr_staff') {
        setActiveTab('hr_dashboard');
      } else if (newRole === 'hr_manager') {
        setActiveTab('analytics');
      } else if (newRole === 'admin') {
        setActiveTab('admin_users');
      }
    }
  };

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const selectTicket = (ticketId: string | null) => {
    setSelectedTicketId(ticketId);
  };

  const createTicket = ({
    title,
    description,
    categoryId,
    priority,
    customData,
    attachments = [],
  }: {
    title: string;
    description: string;
    categoryId: string;
    priority: TicketPriority;
    customData?: Record<string, string>;
    attachments?: Attachment[];
  }): Ticket => {
    const category = categories.find((c) => c.id === categoryId) || categories[0];
    const ticketSeq = 140 + tickets.length + 1;
    const ticketNumber = `HR-2026-0${ticketSeq}`;
    const now = new Date();
    const slaDeadline = new Date(now.getTime() + category.slaHours * 3600 * 1000).toISOString();

    const newTicket: Ticket = {
      id: `tkt_${Date.now()}`,
      ticketNumber,
      title,
      description,
      categoryId: category.id,
      categoryName: category.name,
      categoryGroup: category.groupName,
      priority,
      status: 'submitted',
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterDepartment: currentUser.department,
      requesterEmail: currentUser.email,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaHours: category.slaHours,
      slaDeadline,
      slaPaused: false,
      customData,
      attachments,
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Audit Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      ticketId: newTicket.id,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action: 'TICKET_CREATED',
      details: `Gửi yêu cầu mới: "${title}" (Mức độ: ${priority.toUpperCase()})`,
      timestamp: now.toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Notification to HR Team
    const hrStaff = users.find((u) => u.role === 'hr_staff');
    if (hrStaff) {
      const newNotif: InAppNotification = {
        id: `notif_${Date.now()}`,
        userId: hrStaff.id,
        title: 'Yêu cầu mới cần tiếp nhận',
        message: `${currentUser.name} vừa gửi yêu cầu ${ticketNumber}: "${title}"`,
        ticketId: newTicket.id,
        ticketNumber: newTicket.ticketNumber,
        read: false,
        type: 'assigned',
        createdAt: now.toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }

    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, newStatus: TicketStatus, note?: string) => {
    const now = new Date();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const isPaused = newStatus === 'need_info';
          return {
            ...t,
            status: newStatus,
            updatedAt: now.toISOString(),
            slaPaused: isPaused,
            slaPausedAt: isPaused ? now.toISOString() : undefined,
            resolvedAt: newStatus === 'resolved' ? now.toISOString() : t.resolvedAt,
            closedAt: newStatus === 'closed' ? now.toISOString() : t.closedAt,
          };
        }
        return t;
      })
    );

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    // Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      ticketId,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action: 'STATUS_UPDATED',
      details: `Cập nhật trạng thái sang "${newStatus}"${note ? `: ${note}` : ''}`,
      timestamp: now.toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Notify requester
    const notif: InAppNotification = {
      id: `notif_${Date.now()}`,
      userId: ticket.requesterId,
      title: 'Trạng thái yêu cầu thay đổi',
      message: `Yêu cầu ${ticket.ticketNumber} của bạn đã chuyển sang trạng thái "${newStatus}".`,
      ticketId,
      ticketNumber: ticket.ticketNumber,
      read: false,
      type: 'status_change',
      createdAt: now.toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const assignTicket = (ticketId: string, assigneeId: string) => {
    const assignee = users.find((u) => u.id === assigneeId);
    if (!assignee) return;
    const now = new Date();

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            assigneeId: assignee.id,
            assigneeName: assignee.name,
            assigneeAvatar: assignee.avatar,
            status: t.status === 'submitted' ? 'in_progress' : t.status,
            updatedAt: now.toISOString(),
          };
        }
        return t;
      })
    );

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    // Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      ticketId,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action: 'TICKET_ASSIGNED',
      details: `Phân công xử lý cho ${assignee.name}`,
      timestamp: now.toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Notify assignee
    const notif: InAppNotification = {
      id: `notif_${Date.now()}`,
      userId: assignee.id,
      title: 'Bạn được phân công ticket',
      message: `Bạn được phân công xử lý yêu cầu ${ticket.ticketNumber}: "${ticket.title}"`,
      ticketId,
      ticketNumber: ticket.ticketNumber,
      read: false,
      type: 'assigned',
      createdAt: now.toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const addComment = (ticketId: string, content: string, isInternal: boolean = false, attachments: Attachment[] = []) => {
    const now = new Date();
    const newComment: Comment = {
      id: `cmt_${Date.now()}`,
      ticketId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      content,
      isInternal,
      attachments,
      createdAt: now.toISOString(),
    };

    setComments((prev) => [...prev, newComment]);

    // Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      ticketId,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action: isInternal ? 'INTERNAL_NOTE_ADDED' : 'COMMENT_ADDED',
      details: isInternal ? 'Đã thêm ghi chú nội bộ' : 'Đã gửi phản hồi',
      timestamp: now.toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Notify recipient if not internal
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket && !isInternal) {
      const recipientId = currentUser.id === ticket.requesterId ? ticket.assigneeId : ticket.requesterId;
      if (recipientId) {
        const notif: InAppNotification = {
          id: `notif_${Date.now()}`,
          userId: recipientId,
          title: 'Tin nhắn mới trong ticket',
          message: `${currentUser.name} đã gửi tin nhắn trong ${ticket.ticketNumber}`,
          ticketId,
          ticketNumber: ticket.ticketNumber,
          read: false,
          type: 'new_comment',
          createdAt: now.toISOString(),
        };
        setNotifications((prev) => [notif, ...prev]);
      }
    }
  };

  const rateTicket = (ticketId: string, stars: number, feedback: string) => {
    const now = new Date();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            rating: {
              stars,
              feedback,
              submittedAt: now.toISOString(),
            },
            status: 'closed',
            closedAt: now.toISOString(),
            updatedAt: now.toISOString(),
          };
        }
        return t;
      })
    );

    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    // Log
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      ticketId,
      actorId: currentUser.id,
      actorName: currentUser.name,
      action: 'TICKET_RATED',
      details: `Đánh giá dịch vụ ${stars}/5 sao: "${feedback}"`,
      timestamp: now.toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Notify assignee
    if (ticket.assigneeId) {
      const notif: InAppNotification = {
        id: `notif_${Date.now()}`,
        userId: ticket.assigneeId,
        title: `Nhận đánh giá ⭐ ${stars}/5 sao`,
        message: `${currentUser.name} vừa gửi đánh giá dịch vụ cho yêu cầu ${ticket.ticketNumber}`,
        ticketId,
        ticketNumber: ticket.ticketNumber,
        read: false,
        type: 'status_change',
        createdAt: now.toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const reopenTicket = (ticketId: string, reason: string) => {
    updateTicketStatus(ticketId, 'reopened', reason);
    addComment(ticketId, `[Yêu cầu mở lại]: ${reason}`, false);
  };

  const escalateTicket = (ticketId: string, reason: string) => {
    const hrManager = users.find((u) => u.role === 'hr_manager');
    if (hrManager) {
      assignTicket(ticketId, hrManager.id);
    }
    updateTicketStatus(ticketId, 'escalated', reason);
    addComment(ticketId, `[Escalate lên Trưởng phòng]: ${reason}`, true);
  };

  const requestMoreInfo = (ticketId: string, note: string) => {
    updateTicketStatus(ticketId, 'need_info', note);
    addComment(ticketId, `[Yêu cầu bổ sung thông tin]: ${note}`, false);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateCategorySla = (categoryId: string, newSlaHours: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              slaHours: newSlaHours,
              slaDisplay: `${Math.round(newSlaHours / 8)} ngày làm việc (${newSlaHours}h)`,
            }
          : c
      )
    );
  };

  const addTemplate = (title: string, categoryId: string, content: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    const newTpl: ResponseTemplate = {
      id: `tpl_${Date.now()}`,
      title,
      categoryId,
      categoryName: cat?.name || 'Tất cả',
      content,
    };
    setTemplates((prev) => [newTpl, ...prev]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const resetDemoData = () => {
    setUsers(SEED_USERS);
    setCategories(SEED_CATEGORIES);
    setTickets(SEED_TICKETS);
    setComments(SEED_COMMENTS);
    setTemplates(SEED_TEMPLATES);
    setNotifications(SEED_NOTIFICATIONS);
    setAuditLogs(SEED_AUDIT_LOGS);
    setCurrentUserId('usr_emp_01');
    setSelectedTicketId(null);
    setActiveTab('home');
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        users,
        categories,
        tickets,
        comments,
        templates,
        notifications,
        auditLogs,
        activeTab,
        selectedTicketId,
        isCreateModalOpen,
        filterStatus,
        filterCategory,
        searchQuery,
        switchRole,
        switchUser,
        setActiveTab,
        selectTicket,
        setCreateModalOpen,
        setFilterStatus,
        setFilterCategory,
        setSearchQuery,
        createTicket,
        updateTicketStatus,
        assignTicket,
        addComment,
        rateTicket,
        reopenTicket,
        escalateTicket,
        requestMoreInfo,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateCategorySla,
        addTemplate,
        deleteTemplate,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
