import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Student } from '../../shared/models/student.model';
import { PaginatedResponse, ApiResponse } from '../../shared/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService extends ApiService {
  getStudents(page: number = 1, search?: string): Observable<PaginatedResponse<Student>> {
    const params = this.buildParams({ page, search, page_size: 50 });
    return this.get<any>('/students', params).pipe(
      map(response => {
        const data = response.data;
        // Transform snake_case to camelCase for results
        if (data.results) {
          data.results = data.results.map((student: any) => ({
            id: student.id,
            user: {
              id: student.user.id,
              email: student.user.email,
              name: student.user.name,
              isActive: student.user.is_active
            },
            studentId: student.student_id,
            enrollmentDate: student.enrollment_date,
            phone: student.phone,
            department: student.department,
            year: student.year
          }));
        }
        return data as PaginatedResponse<Student>;
      })
    );
  }

  getStudentById(id: number): Observable<Student> {
    return this.get<any>(`/students/${id}`).pipe(
      map(response => {
        const student = response.data;
        return {
          id: student.id,
          user: {
            id: student.user.id,
            email: student.user.email,
            name: student.user.name,
            isActive: student.user.is_active
          },
          studentId: student.student_id,
          enrollmentDate: student.enrollment_date,
          phone: student.phone,
          department: student.department,
          year: student.year
        } as Student;
      })
    );
  }

  updateStudent(id: number, data: any): Observable<Student> {
    return this.patch<ApiResponse<Student>>(`/students/${id}`, data).pipe(
      map(response => response.data!)
    );
  }

  deactivateStudent(id: number): Observable<void> {
    return this.patch<ApiResponse<void>>(`/students/${id}/deactivate`, {}).pipe(
      map(response => response.data!)
    );
  }
}
