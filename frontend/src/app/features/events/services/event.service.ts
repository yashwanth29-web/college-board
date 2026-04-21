import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Event, EventRegistration } from '../../../shared/models/event.model';
import { PaginatedResponse, ApiResponse } from '../../../shared/models/api.model';

export interface EventCreate {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
}

export interface EventRegistrationResponse {
  event: Event;
  registrations: Array<{
    id: number;
    student: {
      id: number;
      name: string;
      studentId: string;
      email: string;
    };
    registeredAt: string;
  }>;
}

/**
 * Service for managing events
 * Handles event CRUD operations and registrations
 */
@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService {
  private readonly endpoint = '/events';

  /**
   * Get paginated list of events
   * @param page Page number (default: 1)
   * @param pageSize Items per page (default: 20)
   */
  getEvents(page: number = 1, pageSize: number = 20): Observable<PaginatedResponse<Event>> {
    const params = this.buildParams({ page, page_size: pageSize });
    return this.get<ApiResponse<PaginatedResponse<Event>>>(this.endpoint, params).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get a single event by ID
   * @param id Event ID
   */
  getEventById(id: number): Observable<Event> {
    return this.get<ApiResponse<Event>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Create a new event (Admin only)
   * @param data Event data
   */
  createEvent(data: EventCreate): Observable<Event> {
    return this.post<ApiResponse<Event>>(this.endpoint, data).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Register current student for an event
   * @param eventId Event ID
   */
  registerForEvent(eventId: number): Observable<EventRegistration> {
    return this.post<ApiResponse<EventRegistration>>(`${this.endpoint}/${eventId}/register`, {}).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get events the current student is registered for
   */
  getMyEvents(): Observable<Event[]> {
    return this.get<ApiResponse<Event[]>>(`${this.endpoint}/my-events`).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get list of students registered for an event (Admin only)
   * @param eventId Event ID
   */
  getEventRegistrations(eventId: number): Observable<EventRegistrationResponse> {
    return this.get<ApiResponse<EventRegistrationResponse>>(`${this.endpoint}/${eventId}/registrations`).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Update an event (Admin only)
   * @param id Event ID
   * @param data Event data
   */
  updateEvent(id: number, data: Partial<EventCreate>): Observable<Event> {
    return this.patch<ApiResponse<Event>>(`${this.endpoint}/${id}`, data).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Delete an event (Admin only)
   * @param id Event ID
   */
  deleteEvent(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}
