import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReelService } from './reel.service';
import { Reel } from '../../../shared/models/reel.model';
import { PaginatedResponse, ApiResponse } from '../../../shared/models/api.model';

describe('ReelService', () => {
  let service: ReelService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8000/api/reels';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReelService]
    });
    service = TestBed.inject(ReelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get paginated reels', (done) => {
    const mockResponse: ApiResponse<PaginatedResponse<Reel>> = {
      status: 'success',
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [{
          id: 1,
          title: 'Test Reel',
          description: 'Description',
          fileUrl: 'http://example.com/video.mp4',
          fileType: 'video',
          fileSize: 1024000,
          createdBy: { id: 1, name: 'Admin' },
          createdAt: '2024-01-15T10:00:00Z',
          isActive: true,
          views: 100
        }]
      }
    };

    service.getReels(1, 10).subscribe(data => {
      expect(data.results.length).toBe(1);
      expect(data.results[0].title).toBe('Test Reel');
      done();
    });

    const req = httpMock.expectOne(`${baseUrl}?page=1&page_size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should upload reel', (done) => {
    const formData = new FormData();
    formData.append('title', 'New Reel');
    
    const mockResponse: ApiResponse<Reel> = {
      status: 'success',
      data: {
        id: 1,
        title: 'New Reel',
        description: '',
        fileUrl: 'http://example.com/video.mp4',
        fileType: 'video',
        fileSize: 1024000,
        createdBy: { id: 1, name: 'Admin' },
        createdAt: '2024-01-15T10:00:00Z',
        isActive: true,
        views: 0
      }
    };

    service.uploadReel(formData).subscribe(data => {
      expect(data.title).toBe('New Reel');
      done();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
