import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Ticket, TicketStatus } from '../../shared/models/ticket.model';
import { PaginatedResponse, ApiResponse } from '../../shared/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService extends ApiService {
  getTickets(status?: TicketStatus, page: number = 1): Observable<PaginatedResponse<Ticket>> {
    const params = this.buildParams({ status, page });
    return this.get<ApiResponse<PaginatedResponse<Ticket>>>('/tickets', params).pipe(
      map(response => response.data!)
    );
  }

  getMyTickets(): Observable<Ticket[]> {
    return this.get<ApiResponse<PaginatedResponse<Ticket>>>('/tickets').pipe(
      map(response => response.data?.results || [])
    );
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.get<any>(`/tickets/${id}/`).pipe(
      map(response => {
        // DRF ViewSet returns object directly for detail view
        if (response.id) {
          return response as Ticket;
        }
        return response.data as Ticket;
      })
    );
  }

  createTicket(data: { subject: string; description: string; category: string }): Observable<Ticket> {
    return this.post<ApiResponse<Ticket>>('/tickets/', data).pipe(
      map(response => response.data!)
    );
  }

  updateTicketStatus(id: number, status: TicketStatus, assignedTo?: number): Observable<Ticket> {
    return this.patch<ApiResponse<Ticket>>(`/tickets/${id}/`, { status, assigned_to: assignedTo }).pipe(
      map(response => response.data!)
    );
  }

  assignTicket(id: number, adminId: number): Observable<Ticket> {
    return this.patch<ApiResponse<Ticket>>(`/tickets/${id}/`, { assigned_to: adminId }).pipe(
      map(response => response.data!)
    );
  }
}
