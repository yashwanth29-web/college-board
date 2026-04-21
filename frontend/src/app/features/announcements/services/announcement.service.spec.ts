import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnnouncementService } from './announcement.service';
import { Announcement } from '../../../shared/models/announcement.model';
import { PaginatedResponse, ApiResponse } from '../../../shared/models/api.model';

describe('AnnouncementService', () => {
  let service: AnnouncementService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8000/api/announcements';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnnouncementService]
    });
    service = TestBed.inject(AnnouncementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get paginated announcements', (done) => {
    const mockResponse: ApiResponse<PaginatedResponse<Announcement>> = {
      status: 'success',
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          id: 1,
          title: 'Test Announcement',
          content: 'Test content',
          publishedDate: '2024-01-15T10:00:00Z',
          createdBy: { id: 1, name: 'Admin' },
          isActive: true
        }]
      }
    };

    service.getAnnouncements(1, 20).subscribe(data => {
      expect(data.results.length).toBe(1);
      expect(data.results[0].title).toBe('Test Announcement');
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}?page=1&page_size=20`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create announcement', (done) => {
    const newAnnouncement = { title: 'New', content: 'Content' };
    const mockResponse: ApiResponse<Announcement> = {
      status: 'success',
      data: {
        id: 1,
        ...newAnnouncement,
        publishedDate: '2024-01-15T10:00:00Z',
        createdBy: { id: 1, name: 'Admin' },
        isActive: true
      }
    };

    service.createAnnouncement(newAnnouncement).subscribe(data => {
      expect(data.title).toBe('New');
      done();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should delete announcement', (done) => {
    service.deleteAnnouncement(1).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
