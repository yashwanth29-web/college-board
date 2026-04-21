import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Announcement } from '../../../shared/models/announcement.model';
import { PaginatedResponse, ApiResponse } from '../../../shared/models/api.model';

export interface AnnouncementCreate {
  title: string;
  content: string;
}

/**
 * Service for managing announcements
 * Handles CRUD operations for announcements
 */
@Injectable({
  providedIn: 'root'
})
export class AnnouncementService extends ApiService {
  private readonly endpoint = '/announcements';

  /**
   * Get paginated list of announcements
   * @param page Page number (default: 1)
   * @param pageSize Items per page (default: 20)
   */
  getAnnouncements(page: number = 1, pageSize: number = 20): Observable<PaginatedResponse<Announcement>> {
    const params = this.buildParams({ page, page_size: pageSize });
    return this.get<ApiResponse<PaginatedResponse<Announcement>>>(this.endpoint, params).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get a single announcement by ID
   * @param id Announcement ID
   */
  getAnnouncementById(id: number): Observable<Announcement> {
    return this.get<ApiResponse<Announcement>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Create a new announcement (Admin only)
   * @param data Announcement data
   */
  createAnnouncement(data: AnnouncementCreate): Observable<Announcement> {
    return this.post<ApiResponse<Announcement>>(this.endpoint, data).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Delete an announcement (Admin only)
   * @param id Announcement ID
   */
  deleteAnnouncement(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}
