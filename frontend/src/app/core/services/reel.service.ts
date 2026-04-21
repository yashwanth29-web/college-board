import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Reel } from '../../shared/models/reel.model';
import { PaginatedResponse, ApiResponse } from '../../shared/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class ReelService extends ApiService {
  getReels(page: number = 1): Observable<PaginatedResponse<Reel>> {
    const params = this.buildParams({ page, page_size: 10 });
    return this.get<any>('/reels', params).pipe(
      map(response => {
        // Backend wraps paginated response in {status: 'success', data: {...}}
        let paginatedData: any;
        if (response.status === 'success' && response.data) {
          paginatedData = response.data;
        } else if (response.results) {
          paginatedData = response;
        } else {
          paginatedData = response.data;
        }
        
        // Transform snake_case to camelCase for results
        if (paginatedData.results) {
          paginatedData.results = paginatedData.results.map((reel: any) => ({
            id: reel.id,
            title: reel.title,
            description: reel.description,
            fileUrl: reel.file_url,
            fileType: reel.file_type,
            fileSize: reel.file_size,
            thumbnailUrl: reel.thumbnail_url,
            createdBy: {
              id: reel.created_by?.id,
              name: reel.created_by_name
            },
            createdAt: reel.created_at,
            isActive: reel.is_active,
            views: reel.views
          }));
        }
        
        return paginatedData as PaginatedResponse<Reel>;
      })
    );
  }

  uploadReel(formData: FormData): Observable<Reel> {
    return this.post<ApiResponse<any>>('/reels/', formData).pipe(
      map(response => {
        const reel = response.data!;
        // Transform snake_case to camelCase
        return {
          id: reel.id,
          title: reel.title,
          description: reel.description,
          fileUrl: reel.file_url,
          fileType: reel.file_type,
          fileSize: reel.file_size,
          thumbnailUrl: reel.thumbnail_url,
          createdBy: {
            id: reel.created_by?.id,
            name: reel.created_by_name
          },
          createdAt: reel.created_at,
          isActive: reel.is_active,
          views: reel.views
        } as Reel;
      })
    );
  }

  deleteReel(id: number): Observable<void> {
    return this.delete<void>(`/reels/${id}/`);
  }
}
