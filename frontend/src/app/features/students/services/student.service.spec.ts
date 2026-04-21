import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { StudentDetail } from '../../../shared/models/student.model';
import { PaginatedResponse, ApiResponse } from '../../../shared/models/api.model';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8000/api/students';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentService]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get paginated students', (done) => {
    const mockResponse: ApiResponse<PaginatedResponse<StudentDetail>> = {
      status: 'success',
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          id: 1,
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'John Doe',
            isActive: true
          },
          studentId: 'STU001',
          enrollmentDate: '2024-01-15',
          phone: '1234567890',
          department: 'CS',
          year: 2
        }]
      }
    };

    service.getStudents(1, 50).subscribe(data => {
      expect(data.results.length).toBe(1);
      expect(data.results[0].studentId).toBe('STU001');
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}?page=1&page_size=50`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should update student', (done) => {
    const updateData = { department: 'Engineering' };
    const mockResponse: ApiResponse<StudentDetail> = {
      status: 'success',
      data: {
        id: 1,
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'John Doe',
          isActive: true
        },
        studentId: 'STU001',
        enrollmentDate: '2024-01-15',
        department: 'Engineering',
        year: 2
      }
    };

    service.updateStudent(1, updateData).subscribe(data => {
      expect(data.department).toBe('Engineering');
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });

  it('should deactivate student', (done) => {
    const mockResponse: ApiResponse<StudentDetail> = {
      status: 'success',
      data: {
        id: 1,
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'John Doe',
          isActive: false
        },
        studentId: 'STU001',
        enrollmentDate: '2024-01-15'
      }
    };

    service.deactivateStudent(1).subscribe(data => {
      expect(data.user.isActive).toBe(false);
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/1/deactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockResponse);
  });
});
