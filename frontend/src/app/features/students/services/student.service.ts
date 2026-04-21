import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { StudentDetail, StudentUpdate } from '../../../shared/models/student.model';
import { PaginatedResponse, ApiResponse } from '../../../shared/models/api.model';

/**
 * Service for managing students (Admin only)
 * Handles student data retrieval and management
 */
@Injectable({
  providedIn: 'root'
})
export class StudentService extends ApiService {
  private readonly endpoint = '/students';

  /**
   * Get paginated list of students
   * @param page Page number (default: 1)
   * @param pageSize Items per page (default: 50)
   * @param search Optional search query (name, email, or student ID)
   */
  getStudents(page: number = 1, pageSize: number = 50, search?: string): Observable<PaginatedResponse<StudentDetail>> {
    const params: Record<string, any> = { page, page_size: pageSize };
    if (search) {
      params['search'] = search;
    }
    return this.get<ApiResponse<PaginatedResponse<StudentDetail>>>(this.endpoint, this.buildParams(params)).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Get a single student by ID
   * @param id Student ID
   */
  getStudentById(id: number): Observable<StudentDetail> {
    return this.get<ApiResponse<StudentDetail>>(`${this.endpoint}/${id}`).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Update student information
   * @param id Student ID
   * @param data Student update data
   */
  updateStudent(id: number, data: StudentUpdate): Observable<StudentDetail> {
    return this.patch<ApiResponse<StudentDetail>>(`${this.endpoint}/${id}`, data).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Deactivate a student account
   * @param id Student ID
   */
  deactivateStudent(id: number): Observable<StudentDetail> {
    return this.patch<ApiResponse<StudentDetail>>(`${this.endpoint}/${id}/deactivate`, {}).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Activate a student account
   * @param id Student ID
   */
  activateStudent(id: number): Observable<StudentDetail> {
    return this.patch<ApiResponse<StudentDetail>>(`${this.endpoint}/${id}/activate`, {}).pipe(
      map(response => response.data!)
    );
  }

  /**
   * Search students by query
   * @param query Search query (name, email, or student ID)
   */
  searchStudents(query: string): Observable<StudentDetail[]> {
    const params = this.buildParams({ search: query });
    return this.get<ApiResponse<StudentDetail[]>>(`${this.endpoint}/search`, params).pipe(
      map(response => response.data!)
    );
  }
}
