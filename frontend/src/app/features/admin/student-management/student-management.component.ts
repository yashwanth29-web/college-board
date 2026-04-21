import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../shared/models/student.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-student-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <app-navbar />
      
      <main class="p-6">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Student Management</h1>

          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <div class="flex gap-4">
              <input 
                type="text" 
                [(ngModel)]="searchQuery"
                (keyup.enter)="search()"
                placeholder="Search by name, email, or student ID..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                (click)="search()"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>

          @if (loading()) {
            <app-loading-spinner />
          } @else if (error()) {
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {{ error() }}
            </div>
          } @else {
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (student of students(); track student.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ student.studentId }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ student.user.name }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {{ student.user.email }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {{ student.department || 'N/A' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {{ student.year || 'N/A' }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span [class]="student.user.isActive ? 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800' : 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'">
                          {{ student.user.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              @if (hasMore()) {
                <div class="px-6 py-4 bg-gray-50 border-t">
                  <button 
                    (click)="loadMore()"
                    [disabled]="loadingMore()"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    @if (loadingMore()) {
                      <span>Loading...</span>
                    } @else {
                      <span>Load More</span>
                    }
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class StudentManagementComponent implements OnInit {
  students = signal<Student[]>([]);
  loading = signal(false);
  loadingMore = signal(false);
  error = signal<string | null>(null);
  currentPage = signal(1);
  hasMore = signal(true);
  searchQuery = '';

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.loading.set(true);
    this.error.set(null);

    this.studentService.getStudents(this.currentPage(), this.searchQuery).subscribe({
      next: (response) => {
        this.students.set(response.results);
        this.hasMore.set(!!response.next);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load students');
        this.loading.set(false);
      }
    });
  }

  search() {
    this.currentPage.set(1);
    this.loadStudents();
  }

  loadMore() {
    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;

    this.studentService.getStudents(nextPage, this.searchQuery).subscribe({
      next: (response) => {
        this.students.update(current => [...current, ...response.results]);
        this.currentPage.set(nextPage);
        this.hasMore.set(!!response.next);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      }
    });
  }
}
