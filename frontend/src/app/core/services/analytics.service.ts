import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { AnalyticsOverview, ParticipationData, TicketAnalytics } from '../../shared/models/analytics.model';
import { ApiResponse } from '../../shared/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService extends ApiService {
  getOverview(): Observable<AnalyticsOverview> {
    return this.get<any>('/analytics/overview').pipe(
      map(response => {
        const data = response.data;
        return {
          totalStudents: data.total_students,
          totalEvents: data.total_events,
          totalAnnouncements: data.total_announcements,
          totalTickets: data.total_tickets,
          openTickets: data.open_tickets,
          activeEvents: data.active_events
        };
      })
    );
  }

  getParticipation(startDate?: string, endDate?: string): Observable<ParticipationData> {
    const params = this.buildParams({ start_date: startDate, end_date: endDate });
    return this.get<any>('/analytics/participation', params).pipe(
      map(response => {
        const data = response.data;
        return {
          period: data.period,
          totalRegistrations: data.total_registrations,
          events: data.events.map((event: any) => ({
            eventId: event.event_id,
            eventTitle: event.event_title,
            registrations: event.registrations,
            capacity: event.capacity,
            fillRate: event.fill_rate
          })),
          registrationsOverTime: data.registrations_over_time.map((item: any) => ({
            date: item.date,
            count: item.count
          }))
        };
      })
    );
  }

  getTicketAnalytics(startDate?: string, endDate?: string): Observable<TicketAnalytics> {
    const params = this.buildParams({ start_date: startDate, end_date: endDate });
    return this.get<any>('/analytics/tickets', params).pipe(
      map(response => {
        const data = response.data;
        return {
          totalTickets: data.total_tickets,
          statusDistribution: data.status_distribution,
          averageResolutionTimeHours: data.average_resolution_time_hours,
          categoryBreakdown: data.category_breakdown
        };
      })
    );
  }
}
