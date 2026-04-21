import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Event, EventRegistration } from '../../shared/models/event.model';
import { PaginatedResponse, ApiResponse } from '../../shared/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService {
  getEvents(page: number = 1): Observable<PaginatedResponse<Event>> {
    const params = this.buildParams({ page });
    return this.get<any>('/events', params).pipe(
      map(response => {
        // DRF ViewSet returns paginated data directly
        if (response.results) {
          return response as PaginatedResponse<Event>;
        }
        return response.data as PaginatedResponse<Event>;
      })
    );
  }

  getEventById(id: number): Observable<Event> {
    return this.get<any>(`/events/${id}`).pipe(
      map(response => {
        // DRF ViewSet returns object directly for detail view
        if (response.id) {
          return response as Event;
        }
        return response.data as Event;
      })
    );
  }

  createEvent(data: any): Observable<Event> {
    return this.post<ApiResponse<Event>>('/events/', data).pipe(
      map(response => response.data!)
    );
  }

  registerForEvent(eventId: number): Observable<EventRegistration> {
    return this.post<ApiResponse<EventRegistration>>(`/events/${eventId}/register/`, {}).pipe(
      map(response => response.data!)
    );
  }

  getMyEvents(): Observable<Event[]> {
    return this.get<ApiResponse<Event[]>>('/events/my-events').pipe(
      map(response => response.data!)
    );
  }

  getEventRegistrations(eventId: number): Observable<any> {
    return this.get<ApiResponse<any>>(`/events/${eventId}/registrations`).pipe(
      map(response => response.data!)
    );
  }

  deleteEvent(id: number): Observable<void> {
    return this.delete<void>(`/events/${id}/`);
  }
}
