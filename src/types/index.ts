export type Role = 'employee' | 'hr_staff' | 'hr_manager' | 'admin';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'need_info'
  | 'in_progress'
  | 'pending_approval'
  | 'escalated'
  | 'resolved'
  | 'closed'
  | 'reopened';

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  position: string;
  role: Role;
  avatar: string;
  phone?: string;
}

export interface Category {
  id: string;
  groupId: string;
  groupName: string;
  name: string;
  description: string;
  icon: string;
  slaHours: number; // working hours SLA
  slaDisplay: string;
  requiredFields?: DynamicField[];
}

export interface DynamicField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  authorAvatar: string;
  content: string;
  isInternal: boolean; // true = Only HR can see
  attachments?: Attachment[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  ticketId: string;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g., HR-2026-0142
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  categoryGroup: string;
  priority: TicketPriority;
  status: TicketStatus;
  requesterId: string;
  requesterName: string;
  requesterDepartment: string;
  requesterEmail: string;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  createdAt: string;
  updatedAt: string;
  slaHours: number;
  slaDeadline: string;
  slaPaused: boolean;
  slaPausedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  customData?: Record<string, string>;
  attachments: Attachment[];
  rating?: {
    stars: number;
    feedback: string;
    submittedAt: string;
  };
}

export interface ResponseTemplate {
  id: string;
  title: string;
  categoryId?: string;
  categoryName?: string;
  content: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  ticketId?: string;
  ticketNumber?: string;
  read: boolean;
  type: 'status_change' | 'new_comment' | 'sla_warning' | 'assigned';
  createdAt: string;
}
