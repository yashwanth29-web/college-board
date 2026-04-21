import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Announcement } from '../../shared/models/announcement.model';
import { PaginatedResponse, ApiResponse } from '../../shared/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService extends ApiService {
  getAnnouncements(page: number = 1): Observable<PaginatedResponse<Announcement>> {
    const params = this.buildParams({ page });
    return this.get<any>('/announcements', params).pipe(
      map(response => {
        // DRF ViewSet returns paginated data directly, not wrapped in ApiResponse
        if (response.results) {
          return response as PaginatedResponse<Announcement>;
        }
        // Fallback to ApiResponse format
        return response.data as PaginatedResponse<Announcement>;
      })
    );
  }

  getAnnouncementById(id: number): Observable<Announcement> {
    return this.get<any>(`/announcements/${id}`).pipe(
      map(response => {
        // DRF ViewSet returns object directly for detail view
        if (response.id) {
          return response as Announcement;
        }
        return response.data as Announcement;
      })
    );
  }

  createAnnouncement(data: { title: string; content: string }): Observable<Announcement> {
    return this.post<ApiResponse<Announcement>>('/announcements/', data).pipe(
      map(response => response.data!)
    );
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.delete<void>(`/announcements/${id}/`);
  }
}
