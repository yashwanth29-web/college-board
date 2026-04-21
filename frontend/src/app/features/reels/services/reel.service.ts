import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { Reel } from '../../../shared/models/reel.model';
import { PaginatedResponse, ApiResponse } from '../../../shared/models/api.model';

/**
 * Service for managing reels (media content)
 * Handles reel retrieval and upload operations
 */
@Injectable({
  providedIn: 'root'
})
export class ReelService extends ApiService {
  private readonly endpoint = '/reels';

  /**
   * Get paginated list of reels
   * @param page Page number (default: 1)
   * @param pageSize Items per page (default: 10)
   */
  getReels(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Reel>> {
    const params = this.buildParams({ page, page_size: pageSize });
    return this.get<ApiResponse<PaginatedResponse<Reel>>>(this.endpoint, params).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get a single reel by ID
   * @param id Reel ID
   */
  getReelById(id: number): Observable<Reel> {
    return this.get<ApiResponse<Reel>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Upload a new reel (Admin only)
   * @param formData FormData containing title, description, file, and file_type
   */
  uploadReel(formData: FormData): Observable<Reel> {
    // Note: Don't set Content-Type header, let browser set it with boundary
    return this.post<ApiResponse<Reel>>(this.endpoint, formData).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Delete a reel (Admin only)
   * @param id Reel ID
   */
  deleteReel(id: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Increment view count for a reel
   * @param id Reel ID
   */
  incrementViews(id: number): Observable<Reel> {
    return this.post<ApiResponse<Reel>>(`${this.endpoint}/${id}/view`, {}).pipe(
      map(response => response.data!)
    );
  }
}
