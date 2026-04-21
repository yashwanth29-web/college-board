import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Ticket, TicketStatus, TicketCategory } from '../../../shared/models/ticket.model';
import { ApiResponse } from '../../../shared/models/api.model';

export interface TicketCreate {
  subject: string;
  description: string;
  category: TicketCategory;
}

export interface TicketStatusUpdate {
  status: TicketStatus;
}

export interface TicketAssignment {
  assignedTo: number;
}

/**
 * Service for managing support tickets
 * Handles ticket CRUD operations and status updates
 */
@Injectable({
  providedIn: 'root'
})
export class TicketService extends ApiService {
  private readonly endpoint = '/tickets';

  /**
   * Get tickets (filtered by role)
   * Students see their own tickets, admins see all tickets
   */
  getTickets(): Observable<Ticket[]> {
    return this.get<ApiResponse<Ticket[]>>(this.endpoint).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get a single ticket by ID
   * @param id Ticket ID
   */
  getTicketById(id: number): Observable<Ticket> {
    return this.get<ApiResponse<Ticket>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Create a new support ticket
   * @param data Ticket data
   */
  createTicket(data: TicketCreate): Observable<Ticket> {
    return this.post<ApiResponse<Ticket>>(this.endpoint, data).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Update ticket status (Admin only)
   * @param id Ticket ID
   * @param status New status
   */
  updateTicketStatus(id: number, status: TicketStatus): Observable<Ticket> {
    return this.patch<ApiResponse<Ticket>>(`${this.endpoint}/${id}`, { status }).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Assign ticket to an administrator (Admin only)
   * @param id Ticket ID
   * @param adminId Administrator user ID
   */
  assignTicket(id: number, adminId: number): Observable<Ticket> {
    return this.patch<ApiResponse<Ticket>>(`${this.endpoint}/${id}`, { assigned_to: adminId }).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get tickets filtered by status
   * @param status Ticket status
   */
  getTicketsByStatus(status: TicketStatus): Observable<Ticket[]> {
    const params = this.buildParams({ status });
    return this.get<ApiResponse<Ticket[]>>(this.endpoint, params).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get tickets filtered by category
   * @param category Ticket category
   */
  getTicketsByCategory(category: TicketCategory): Observable<Ticket[]> {
    const params = this.buildParams({ category });
    return this.get<ApiResponse<Ticket[]>>(this.endpoint, params).pipe(
      map(response => response.data!)
    );
  }
}
