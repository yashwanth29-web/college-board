export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketCategory = 'technical' | 'academic' | 'administrative' | 'other';

export interface Ticket {
  id: number;
  subject: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  student: {
    id: number;
    name: string;
    studentId: string;
  };
  assignedTo?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
