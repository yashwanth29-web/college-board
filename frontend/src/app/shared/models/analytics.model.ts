export interface AnalyticsOverview {
  totalStudents: number;
  totalEvents: number;
  totalAnnouncements: number;
  totalTickets: number;
  openTickets: number;
  activeEvents: number;
}

export interface ParticipationData {
  period: {
    start: string;
    end: string;
  };
  totalRegistrations: number;
  events: Array<{
    eventId: number;
    eventTitle: string;
    registrations: number;
    capacity: number;
    fillRate: number;
  }>;
  registrationsOverTime: Array<{
    date: string;
    count: number;
  }>;
}

export interface TicketAnalytics {
  totalTickets: number;
  statusDistribution: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  averageResolutionTimeHours: number;
  categoryBreakdown: {
    technical: number;
    academic: number;
    administrative: number;
    other: number;
  };
}
